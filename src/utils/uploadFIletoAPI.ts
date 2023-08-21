import DocumentPicker from 'react-native-document-picker';
import {postAuthenticatedRequest, postRequest} from './api';
import {APIConfig} from '../actions/config';

export const uploadFileToAPI = async ({route, key, setUploading}: any) => {
  // Opening Document Picker to select one file
  const res = await DocumentPicker.pick({
    type: ['text/csv', 'text/comma-separated-values'], // Provide which type of file you want user to pick
  });
  console.log('res : ' + JSON.stringify(res));
  setUploading(true);
  let formdata = new FormData();
  formdata.append(key, res);

  const fileToUpload = res[0];
  const data = new FormData();
  data.append(key, fileToUpload);
  // Please change file upload URL

  //   const response = await postRequest(route, data, {
  //     'Content-Type': 'multipart/form-data',
  //   });
  const response = await fetch(
    `${APIConfig.protocol}://${APIConfig.url}${route}`,
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response;
};
