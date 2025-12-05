import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { setoresService } from '../services/api';

export default function NFCReaderScreen({ navigation }: any) {
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        initNFC();
        return () => {
            NfcManager.cancelTechnologyRequest().catch(() => { });
        };
    }, []);

    const initNFC = async () => {
        try {
            const supported = await NfcManager.isSupported();
            if (!supported) {
                Alert.alert('Erro', 'NFC não suportado neste dispositivo');
                navigation.goBack();
            }
            await NfcManager.start();
        } catch (error) {
            console.error('Erro ao inicializar NFC:', error);
        }
    };

    const readNFC = async () => {
        setIsReading(true);
        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);

            const tag = await NfcManager.getTag();
            console.log('Tag detectada:', tag);

            if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
                const record = tag.ndefMessage[0];
                const payload = Ndef.text.decodePayload(record.payload);

                // Buscar setor pelo código
                const setor = await setoresService.buscarPorCodigo(payload);
                navigation.navigate('Higienizacao', { setor, codigo: payload });
            } else {
                Alert.alert('Erro', 'Tag NFC vazia ou inválida');
            }
        } catch (error: any) {
            console.error('Erro ao ler NFC:', error);
            if (error.toString().includes('cancelled')) {
                // Usuário cancelou
            } else {
                Alert.alert('Erro', 'Falha ao ler tag NFC');
            }
        } finally {
            setIsReading(false);
            NfcManager.cancelTechnologyRequest().catch(() => { });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>📱</Text>
            </View>

            <Text style={styles.title}>Leitura NFC/RFID</Text>
            <Text style={styles.instructions}>
                {isReading
                    ? 'Aproxime a tag do dispositivo...'
                    : 'Toque no botão abaixo e aproxime a tag NFC/RFID'}
            </Text>

            <TouchableOpacity
                style={[styles.button, isReading && styles.buttonDisabled]}
                onPress={readNFC}
                disabled={isReading}
            >
                <Text style={styles.buttonText}>
                    {isReading ? 'Lendo...' : 'Iniciar Leitura'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    icon: {
        fontSize: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    instructions: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#34C759',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        minWidth: 200,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 20,
        padding: 15,
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontSize: 16,
    },
});
