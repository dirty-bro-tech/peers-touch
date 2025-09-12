# ActivityPub Database UML Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    peers_touch_part {
        string ptn_id PK "peers-touch-network id - ActivityPub URI for this participant"
        string ptn_handle UK "part's handle within own domain. Unique handle on this domain (e.g. 'alice\@example\.com')"
        string pth_name "Human-readable display name"
        string description "Bio/description text"
        string activity_inbox "ActivityPub inbox endpoint URL"
        string activity_outbox "ActivityPub outbox endpoint URL"
        string followers_collection "ActivityPub followers collection URL"
        string following_collection "ActivityPub following collection URL"
        string verification_key "Public key for signature verification"
        string signing_key "Private key for signing activities"
        timestamp established_at "When this participant was first seen"
        timestamp modified_at "Last update to participant metadata"
    }
    
    content_items {
        string object_uri PK "Unique ActivityPub Object URI for this content"
        string origin_participant FK
        string object_class "Type: Note, Article, Image, etc."
        string body_content "Main content body"
        string content_warning "Content summary or CW text"
        string web_url "URL to attached media/file"
        timestamp published_at "When content was first published"
        timestamp revised_at "Last content modification"
        string reply_target "Object URI this content replies to (threading)"
        string[] direct_recipients
        string[] cc_recipients
        boolean requires_consent
    }
    
    activity_log {
        string activity_uri PK "Unique ActivityPub Activity ID"
        string initiator_participant FK "ptn_id - Participant who performed this activity"
        string activity_type "Type: Create, Update, Delete, Follow, Like, etc."
        string target_object "Content item this activity targets"
        string target_collection "Collection this activity targets"
        string activity_note "Human-readable note about this activity"
        timestamp occurred_at "When this activity was received"
        string generated_content FK "Content item created by this activity"
    }
    
    relationship_matrix {
        string follow_activity PK "ActivityPub Activity ID for the Follow"
        string subscriber_participant FK "ptn_id - Participant who is following"
        string publisher_participant FK "ptn_id - Participant being followed"
        boolean relationship_status "Whether the follow is active"
        timestamp established_at "When this follow relationship was established"
    }
    
    activity_streams {
        string stream_id PK
        string owner_participant FK
        string stream_type
        integer item_count
        timestamp created_at
        timestamp updated_at
    }
    
    stream_contents {
        bigint sequence_id PK
        string parent_stream FK
        string linked_activity FK
        string linked_content FK
        timestamp added_at
    }
    
    media_references {
        string attachment_uri PK
        string parent_content FK
        string media_url
        string media_category
        string original_name
        integer byte_size
        integer pixel_width
        integer pixel_height
        string placeholder_hash
        string accessibility_text
        timestamp attached_at
    }

    peers_touch_part ||--o{ content_items : "originates"
    peers_touch_part ||--o{ activity_log : "initiates"
    peers_touch_part ||--o{ relationship_matrix : "subscribes as"
    peers_touch_part ||--o{ relationship_matrix : "publishes as"
    peers_touch_part ||--o{ activity_streams : "owns"
    
    content_items ||--o{ content_items : "replies to"
    content_items ||--o{ activity_log : "referenced by"
    content_items ||--o{ media_references : "contains"
    content_items ||--o{ stream_contents : "included in"
    
    activity_log ||--o{ content_items : "creates"
    activity_log ||--o{ stream_contents : "appears in"
    
    activity_streams ||--o{ stream_contents : "contains"
    
    stream_contents ||--o{ activity_log : "links to"
    stream_contents ||--o{ content_items : "links to"
```

## Table Descriptions & Relationships

### Core Entities

#### peers_touch_part
**Purpose**: Master identity registry for all federation participants
- **Primary Key**: `canonical_id` (ActivityPub URI)
- **Unique**: `local_handle` (must be unique per domain)
- **Relationships**:
  - One participant can originate many `content_items`
  - One participant can initiate many `activity_log` entries
  - One participant can be both subscriber and publisher in `relationship_matrix`
  - One participant owns multiple `activity_streams`

#### content_items
**Purpose**: Federated content objects (posts, articles, etc.)
- **Primary Key**: `object_uri` (ActivityPub Object ID)
- **Foreign Keys**:
  - `origin_participant` → `participant_registry.canonical_id`
  - `reply_target` → `content_items.object_uri` (self-referencing for threading)
- **Relationships**:
  - Many content items can reply to one parent content item
  - One content item can have many media attachments
  - One content item can appear in many collection streams

#### activity_log
**Purpose**: Chronological record of all ActivityPub activities
- **Primary Key**: `activity_uri` (ActivityPub Activity ID)
- **Foreign Keys**:
  - `initiator_participant` → `participant_registry.canonical_id`
  - `generated_content` → `content_items.object_uri` (for Create activities)
- **Relationships**:
  - One activity can create one content item (Create activities)
  - One activity can appear in many collection streams

#### relationship_matrix
**Purpose**: Follow relationships between participants
- **Primary Key**: `follow_activity` (ActivityPub Activity ID)
- **Foreign Keys**:
  - `subscriber_participant` → `participant_registry.canonical_id`
  - `publisher_participant` → `participant_registry.canonical_id`
- **Unique Constraint**: `(subscriber_participant, publisher_participant)` prevents duplicate follows
- **Relationships**: Represents asymmetric relationships between participants

### Collection Management

#### activity_streams
**Purpose**: ActivityPub collections (inbox, outbox, followers, following)
- **Primary Key**: `stream_id` (composite of owner + type)
- **Foreign Key**: `owner_participant` → `participant_registry.canonical_id`
- **Unique Constraint**: `(owner_participant, stream_type)` ensures one collection per type per owner
- **Relationships**: Each participant has exactly 4 standard collections

#### stream_contents
**Purpose**: Items within ActivityPub collections
- **Primary Key**: `sequence_id` (auto-incrementing for ordering)
- **Foreign Keys**:
  - `parent_stream` → `activity_streams.stream_id`
  - `linked_activity` → `activity_log.activity_uri`
  - `linked_content` → `content_items.object_uri`
- **Check Constraint**: Ensures exactly one of `linked_activity` or `linked_content` is populated
- **Relationships**: Links activities and content to their containing collections

### Media Management

#### media_references
**Purpose**: Media attachments for content items
- **Primary Key**: `attachment_uri` (ActivityPub Object ID)
- **Foreign Key**: `parent_content` → `content_items.object_uri`
- **Relationships**: One content item can have many media attachments

## Cardinality Summary

| Relationship Type | Description |
|------------------|-------------|
| 1:N | One participant originates many content items |
| 1:N | One participant initiates many activities |
| 1:N | One participant owns many activity streams |
| N:M | Many-to-many follows via relationship_matrix |
| 1:N | One content item has many media attachments |
| 1:N | One activity stream contains many stream contents |
| 1:1 | One Create activity creates one content item |

## Index Strategy

### Primary Access Patterns
1. **Participant Lookup**: `canonical_id` (PK) and `local_handle` (UK)
2. **Content Timeline**: `origin_participant` + `published_at DESC`
3. **Activity Feed**: `initiator_participant` + `occurred_at DESC`
4. **Thread Navigation**: `reply_target` for conversation threading
5. **Collection Items**: `parent_stream` + `added_at DESC` for pagination

### Performance Considerations
- All foreign keys are indexed automatically
- Composite indexes needed for common query patterns
- `sequence_id` in stream_contents provides stable ordering for pagination
- Array fields (`direct_recipients`, `cc_recipients`) require GIN indexes for efficient querying