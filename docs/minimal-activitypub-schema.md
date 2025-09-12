# peers-touch-go ActivityPub Database Design

A streamlined federation layer designed for lightweight ActivityPub interoperability in distributed systems.

## Architecture Overview

This schema implements a focused subset of ActivityPub 1.0 specifications, optimized for minimal resource usage while maintaining protocol compatibility. The design prioritizes clarity over complexity, providing essential federation capabilities without feature bloat.

## Entity Definitions

### participant_registry
Represents federation participants across the network, serving as the primary identity anchor.

```sql
CREATE TABLE participant_registry (
  -- Canonical ActivityPub identifier (https://$domain.$tld/$entity/$handle)
  canonical_id varchar PRIMARY KEY,
  -- Local system handle (unique per domain)
  local_handle varchar NOT NULL,
  -- Human-presentable display label
  display_label varchar,
  -- Brief biographical/organizational description
  description text,
  -- ActivityPub inbox endpoint for incoming activities
  activity_inbox varchar NOT NULL,
  -- ActivityPub outbox endpoint for published activities  
  activity_outbox varchar NOT NULL,
  -- Followers collection reference
  followers_collection varchar NOT NULL,
  -- Following collection reference
  following_collection varchar NOT NULL,
  -- Public key material for HTTP signature verification
  verification_key text NOT NULL,
  -- Optional encrypted private key for outbound signatures
  signing_key text,
  -- Record creation timestamp
  established_at timestamp NOT NULL DEFAULT now(),
  -- Last modification timestamp
  modified_at timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX participant_registry_local_handle_idx ON participant_registry (local_handle);
```

### content_items
Stores federated content objects with ActivityPub object lifecycle management.

```sql
CREATE TABLE content_items (
  -- ActivityPub Object identifier
  object_uri varchar PRIMARY KEY,
  -- Author participant reference
  origin_participant varchar NOT NULL REFERENCES participant_registry(canonical_id) ON DELETE CASCADE,
  -- ActivityPub object classification (Note, Article, Question, etc.)
  object_class varchar NOT NULL,
  -- Primary textual content (HTML or plain text)
  body_content text,
  -- Content warning or brief summary
  content_warning text,
  -- Web-accessible URL for direct viewing
  web_url varchar,
  -- Publication timestamp
  published_at timestamp NOT NULL DEFAULT now(),
  -- Last update timestamp
  revised_at timestamp DEFAULT now(),
  -- Parent object reference for threaded discussions
  reply_target varchar,
  -- Direct recipient participants (ActivityPub 'to' field)
  direct_recipients varchar[],
  -- Carbon-copy recipient participants (ActivityPub 'cc' field)
  cc_recipients varchar[],
  -- Content sensitivity flag
  requires_consent boolean DEFAULT false
);

CREATE INDEX content_items_origin_idx ON content_items (origin_participant);
CREATE INDEX content_items_publication_idx ON content_items (published_at DESC);
CREATE INDEX content_items_thread_idx ON content_items (reply_target);
```

### activity_log
Chronological record of all ActivityPub activities processed by the system.

```sql
CREATE TABLE activity_log (
  -- ActivityPub Activity identifier
  activity_uri varchar PRIMARY KEY,
  -- Acting participant reference
  initiator_participant varchar NOT NULL REFERENCES participant_registry(canonical_id) ON DELETE CASCADE,
  -- Activity type classification (Create, Follow, Like, Announce, Undo, etc.)
  activity_type varchar NOT NULL,
  -- Target object identifier (for Like, Announce, etc.)
  target_object varchar,
  -- Target collection or participant (for Follow activities)
  target_collection varchar,
  -- Activity summary or note
  activity_note text,
  -- Activity publication timestamp
  occurred_at timestamp NOT NULL DEFAULT now(),
  -- For Create activities, reference to generated content item
  generated_content varchar REFERENCES content_items(object_uri) ON DELETE SET NULL
);

CREATE INDEX activity_log_initiator_idx ON activity_log (initiator_participant);
CREATE INDEX activity_log_type_idx ON activity_log (activity_type);
CREATE INDEX activity_log_target_idx ON activity_log (target_object);
CREATE INDEX activity_log_chronological_idx ON activity_log (occurred_at DESC);
```

### relationship_matrix
Manages asymmetric follow relationships between federation participants.

```sql
CREATE TABLE relationship_matrix (
  -- ActivityPub Activity identifier for the follow action
  follow_activity varchar PRIMARY KEY,
  -- Participant initiating the follow relationship
  subscriber_participant varchar NOT NULL REFERENCES participant_registry(canonical_id) ON DELETE CASCADE,
  -- Participant being followed
  publisher_participant varchar NOT NULL REFERENCES participant_registry(canonical_id) ON DELETE CASCADE,
  -- Follow request acceptance status
  relationship_status boolean DEFAULT false,
  -- Relationship establishment timestamp
  established_at timestamp NOT NULL DEFAULT now(),
  UNIQUE (subscriber_participant, publisher_participant)
);

CREATE INDEX relationship_matrix_subscriber_idx ON relationship_matrix (subscriber_participant);
CREATE INDEX relationship_matrix_publisher_idx ON relationship_matrix (publisher_participant);
```

### activity_streams
Collection management for ActivityPub inbox/outbox/followers/following collections.

```sql
CREATE TABLE activity_streams (
  -- Stream identifier (combination of owner and stream type)
  stream_id varchar PRIMARY KEY,
  -- Owning participant
  owner_participant varchar NOT NULL REFERENCES participant_registry(canonical_id) ON DELETE CASCADE,
  -- Stream classification (inbox, outbox, followers, following)
  stream_type varchar NOT NULL,
  -- Cached item count for pagination
  item_count integer DEFAULT 0,
  -- Stream creation timestamp
  created_at timestamp NOT NULL DEFAULT now(),
  -- Last update timestamp
  updated_at timestamp NOT NULL DEFAULT now(),
  UNIQUE (owner_participant, stream_type)
);

CREATE INDEX activity_streams_owner_idx ON activity_streams (owner_participant);
```

### stream_contents
Individual items within ActivityPub collections, linking activities and content to their containing streams.

```sql
CREATE TABLE stream_contents (
  -- Sequential identifier for ordering
  sequence_id bigserial PRIMARY KEY,
  -- Containing activity stream
  parent_stream varchar NOT NULL REFERENCES activity_streams(stream_id) ON DELETE CASCADE,
  -- Associated activity (for inbox/outbox streams)
  linked_activity varchar REFERENCES activity_log(activity_uri) ON DELETE CASCADE,
  -- Associated content item (for followers/following collections)
  linked_content varchar REFERENCES content_items(object_uri) ON DELETE CASCADE,
  -- Item insertion timestamp
  added_at timestamp NOT NULL DEFAULT now(),
  
  -- Ensure single association type per item
  CHECK (
    (linked_activity IS NOT NULL AND linked_content IS NULL) OR
    (linked_activity IS NULL AND linked_content IS NOT NULL)
  )
);

CREATE INDEX stream_contents_stream_idx ON stream_contents (parent_stream);
CREATE INDEX stream_contents_chronological_idx ON stream_contents (added_at DESC);
CREATE UNIQUE INDEX stream_contents_unique_idx ON stream_contents (parent_stream, linked_activity, linked_content);
```

### media_references
Lightweight media attachment management for federated content.

```sql
CREATE TABLE media_references (
  -- ActivityPub Object identifier for the attachment
  attachment_uri varchar PRIMARY KEY,
  -- Parent content item
  parent_content varchar NOT NULL REFERENCES content_items(object_uri) ON DELETE CASCADE,
  -- Media file URL
  media_url varchar NOT NULL,
  -- Media classification (image, video, audio, document)
  media_category varchar NOT NULL,
  -- Original filename
  original_name varchar,
  -- File size in bytes
  byte_size integer,
  -- Image/video dimensions
  pixel_width integer,
  pixel_height integer,
  -- BlurHash for progressive loading placeholders
  placeholder_hash varchar,
  -- Accessibility description
  accessibility_text text,
  -- Attachment creation timestamp
  attached_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX media_references_parent_idx ON media_references (parent_content);
CREATE INDEX media_references_category_idx ON media_references (media_category);
```

## Design Philosophy

This schema embodies several architectural decisions:

- **Identity-First**: Uses ActivityPub URIs as primary keys to maintain federation integrity
- **Collection-Oriented**: Separates collection metadata from actual content for efficient pagination
- **Activity-Centric**: All state changes flow through explicit activity records
- **Minimal Complexity**: Excludes advanced features (moderation, caching, analytics) for clarity
- **Extensible Foundation**: Clean base for adding domain-specific functionality

## Implementation Guidelines

- **Identifier Generation**: Use ULIDs or UUIDv7 for local URI components
- **Indexing Strategy**: Add composite indexes for common query patterns
- **Performance Optimization**: Consider materialized views for collection counts
- **Data Retention**: Implement retention policies for ephemeral activities
- **Security**: Validate all incoming URIs and implement rate limiting
- **Migration**: Design with forward-compatibility for protocol extensions

This foundation provides essential ActivityPub federation capabilities while remaining lightweight and maintainable for specialized applications.