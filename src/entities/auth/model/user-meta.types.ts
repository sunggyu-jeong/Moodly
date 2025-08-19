export interface UserMetaDTO {
  userId: string;
  isFirstLoad: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirstLaunchFlagDTO {
  userId: string;
  isFirstLoad: boolean;
  createdAt?: string;
}

export interface InitializeSessionDTO {
  userId: string;
  created: boolean;
}

export interface UpdateFirstLaunchFlagInput {
  isFirstLoad: boolean;
}
