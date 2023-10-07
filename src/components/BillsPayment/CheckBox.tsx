import {useEffect, useRef, useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Colors} from '../../styles';

const CheckBox = ({
  cellData,
  index,
  onPress,
}: {
  cellData?: any;
  index?: number;
  onPress: Function;
}) => {
  const [checkboxState, setCheckboxState] = useState(false);
  const bouncyCheckboxRef = useRef(null);

  useEffect(() => {
    if (cellData) {
      setCheckboxState(true);
    } else {
      setCheckboxState(false);
    }
  }, [cellData]);

  return (
    <BouncyCheckbox
      key={index}
      disableText={true}
      style={{alignSelf: 'center'}}
      fillColor={Colors.PRIMARY}
      ref={(ref: any) => bouncyCheckboxRef}
      isChecked={checkboxState}
      disableBuiltInState
      onPress={() => {
        if (cellData) {
          setCheckboxState(false);
        } else if (cellData === '') {
          setCheckboxState(true);
        } else {
          setCheckboxState(!checkboxState);
        }
        onPress(index);
      }}
    />
  );
};

export default CheckBox;
