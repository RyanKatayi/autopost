export class LinkedInClient {
  private accessToken: string;
  private baseUrl = 'https://api.linkedin.com/v2';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LinkedIn API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getProfile() {
    // Use the OpenID Connect userinfo endpoint
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LinkedIn API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async sharePost(content: {
    text: string;
    visibility?: 'PUBLIC' | 'CONNECTIONS';
  }) {
    const profile = await this.getProfile();
    // OpenID Connect returns 'sub' as the unique identifier
    const authorUrn = `urn:li:person:${profile.sub}`;

    const postData = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': content.visibility || 'PUBLIC',
      },
    };

    return this.makeRequest('/ugcPosts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async shareArticle(content: {
    text: string;
    url: string;
    title?: string;
    description?: string;
    visibility?: 'PUBLIC' | 'CONNECTIONS';
  }) {
    const profile = await this.getProfile();
    // OpenID Connect returns 'sub' as the unique identifier
    const authorUrn = `urn:li:person:${profile.sub}`;

    const postData = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              originalUrl: content.url,
              title: {
                text: content.title || '',
              },
              description: {
                text: content.description || '',
              },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': content.visibility || 'PUBLIC',
      },
    };

    return this.makeRequest('/ugcPosts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async uploadImage(imageBuffer: Buffer, contentType: string) {
    const profile = await this.getProfile();
    // OpenID Connect returns 'sub' as the unique identifier
    const authorUrn = `urn:li:person:${profile.sub}`;

    // Step 1: Register the upload
    const registerData = {
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: authorUrn,
        serviceRelationships: [
          {
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent',
          },
        ],
      },
    };

    const registerResponse = await this.makeRequest('/assets?action=registerUpload', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });

    const uploadUrl = registerResponse.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    const asset = registerResponse.value.asset;

    // Step 2: Upload the image
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': contentType,
      },
      body: imageBuffer,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Image upload failed: ${uploadResponse.status}`);
    }

    return asset;
  }

  async shareWithImage(content: {
    text: string;
    imageBuffer: Buffer;
    imageContentType: string;
    altText?: string;
    visibility?: 'PUBLIC' | 'CONNECTIONS';
  }) {
    const profile = await this.getProfile();
    // OpenID Connect returns 'sub' as the unique identifier
    const authorUrn = `urn:li:person:${profile.sub}`;
    
    // Upload the image first
    const asset = await this.uploadImage(content.imageBuffer, content.imageContentType);

    const postData = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              media: asset,
              title: {
                text: content.altText || 'Image',
              },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': content.visibility || 'PUBLIC',
      },
    };

    return this.makeRequest('/ugcPosts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }
}