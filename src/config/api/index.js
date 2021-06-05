import { AXIOS_INSTANCE, FILEUPLOAD_AXIOS_INSTANCE } from './apiconfig';

export const API={
    signup: (param1, param2) => {
        return AXIOS_INSTANCE.post('/', { param1, param2});
      },
}