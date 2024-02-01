export class MessageErrorResultDto {
  readonly me: {
    id: {
      server: string;
      user: string;
      _serialized: string;
    };
    displayName: string | null;
    verifiedName: string;
    searchName: string | null;
    pushname: string;
    notifyName: string | null;
    isBusiness: boolean;
    formattedUser: string | null;
    tag: string;
    eurl: string;
    previewEurl: string;
    fullDirectPath: string;
    previewDirectPath: string;
    filehash: string;
    stale: boolean;
    eurlStale: boolean;
    timestamp: number;
    hostRetryCount: number;
    lastHostUsed: {
      hostname: string;
      ips: [
        {
          ip4: string;
          ip6: string;
        },
      ];
      type: string;
      class: string;
      downloadBuckets: [number];
      _supportedDownloadTypes: {};
      _supportedUploadTypes: {};
      fallback: {
        hostname: string;
        ips: [
          {
            ip4: string;
            ip6: string;
          },
        ];
        type: string;
        class: string;
        downloadBuckets: [number];
        _supportedDownloadTypes: {};
        _supportedUploadTypes: {};
        fallback: string | null;
      };
      selectedBucket: number;
    };
    dataSource: string;
    description: string | null;
    categories: [
      {
        id: string;
        localized_display_name: string;
      },
    ];
    profileOptions: {
      commerceExperience: string;
      cartEnabled: boolean;
    };
    email: string | null;
    website: [];
    latitude: string | null;
    longitude: string | null;
    businessHours: string | null;
    address: string | null;
    fbPage: {};
    igProfessional: {};
    isProfileLinked: boolean;
    isProfileLocked: boolean;
    coverPhoto: string | null;
    automatedType: string;
    welcomeMsgProtocolMode: string;
    prompts: string | null;
    commandsDescription: string | null;
    commands: string | null;
  };
  readonly to: string;
  readonly erro: boolean;
  readonly text: string;
  status: null;
}
