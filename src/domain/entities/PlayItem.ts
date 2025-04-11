/**
 * Represents a single item in a playlist.
 * This interface defines the structure of a playable item, such as a video or audio track.
 */
export interface PlayItem {
    /** Date when the item was published */
    publishedAt: Date;
    /** ID of the channel that owns the item */
    channelId: string;
    /** Title of the item */
    title: string;
    /** Optional description of the item */
    description?: string;
    /** Optional URL to the item's thumbnail image */
    thumbnail?: string;
    /** Title of the channel that owns the item */
    channelTitle: string;

    /** Position of the item in the playlist */
    position: number;
    /** Resource information for the item */
    resource: Resource;
    /** Optional ID of the video owner's channel */
    videoOwnerChannelId?: string;
    /** Optional title of the video owner's channel */
    videoOwnerChannelTitle?: string;
}

/**
 * Contains resource information for a playable item.
 * This interface provides details about the type and ID of the media resource.
 */
export interface Resource {
    /** Type of resource (e.g., 'youtube#video') */
    kind: string;
    /** Unique identifier for the video resource */
    videoId: string;
}