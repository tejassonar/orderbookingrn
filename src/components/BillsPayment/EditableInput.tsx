import {TextInput} from 'react-native';
import {Colors} from '../../styles';

const EditableInput = ({
  cellData,
  index,
  onChange,
}: {
  cellData?: any;
  index?: number;
  onChange?: Function;
}) => {
  return (
    <TextInput
      style={{height: 40, alignSelf: 'center', color: Colors.TEXT_COLOR}}
      placeholder=""
      onChangeText={newText => onChange(index, newText)}
      // defaultValue={cellData}
      value={`${cellData ?? ''}`}
      keyboardType="numeric"
    />
  );
};

export default EditableInput;
