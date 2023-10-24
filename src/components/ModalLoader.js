import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { Modal } from 'react-native-paper';
import { THEME } from '../theme/appTheme';

const styles = StyleSheet.create({
    modelViewContainer: {
        height: 100,
        width:300,
        borderRadius: 12,
        alignSelf:'center',
        justifyContent: 'center',
        backgroundColor: THEME.white
    },
    title: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        lineHeight: 16,
        color: THEME.black,
        alignSelf:'center'
    }
});
const ModalLoader = ({ visible, title, hideModal }) => {
    return (
            <Modal
                visible={visible}
                onDismiss={hideModal}
                animationType='slide'
                transparent={true}
                
            >
                <View style={styles.modelViewContainer}>
                    <ActivityIndicator color={THEME.primary} size={40} />
                    {title && <Text style={styles.title}>{title}</Text>}
                </View>
            </Modal>
    )
}

export default ModalLoader;