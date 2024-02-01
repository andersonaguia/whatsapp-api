export class MessageSuccessResultDto {
  readonly me: {
    id: {
      server: string;
      user: string;
      _serialized: string;
    };
    displayName: string | null;
    verifiedName: string | null;
    searchName: string | null;
    pushname: string;
    notifyName: string | null;
    isBusiness: true;
    formattedUser: string | null;
    tag: string;
    eurl: string;
    previewEurl: string;
    fullDirectPath: string;
    previewDirectPath: string;
    filehash: string;
    stale: false;
    eurlStale: false;
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
      cartEnabled: true;
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
  readonly to: {
    fromMe: boolean;
    remote: {
      server: string;
      user: string;
      _serialized: string;
    };
    id: string;
    _serialized: string;
  };
  readonly erro: boolean;
  readonly text: string;
  readonly status: {
    messageSendResult: string;
    t: number;
    count: number;
  };
}


