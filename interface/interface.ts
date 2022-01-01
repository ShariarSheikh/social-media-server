export interface User {
  email: string;
  name: string;
  profileImg: string;
  _id: string;
}

export interface ApiHeaderCreate {
  name: string;
  about: string;
  isCompleted: boolean;
  apiData: {}[];
  apiSpeed: string;
  apiSecretKey: string;
}

