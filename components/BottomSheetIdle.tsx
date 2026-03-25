import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import {useTheme} from "react-native-zustand-theme";
import { useMemo } from 'react'

const BottomSheetIdle = () => {

    const { theme } = useTheme()
    const styles = useMemo(() => createStyles(theme), [theme]);
    return (
        <View>
            <Text>This is the ride hailing side</Text>
        </View>
    )
};

export default BottomSheetIdle;

const createStyles = (theme: any) => StyleSheet.create({

})
