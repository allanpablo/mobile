import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { setoresService } from '../services/api';

export default function ScannerScreen({ navigation }: any) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned) return; // Prevent multiple scans while processing
        setScanned(true);

        try {
            // Tenta buscar setor pelo código (QR Code ou RFID manual)
            const setor = await setoresService.buscarPorCodigo(data);

            // Inicia higienização
            const higienizacao = await higienizacaoService.iniciar(setor.codigo);

            Toast.show({
                type: 'success',
                text1: 'Higienização Iniciada',
                text2: `Setor: ${setor.nome}`,
            });

            navigation.navigate('Higienizacao', {
                setor,
                higienizacaoId: higienizacao.id
            });
        } catch (error: any) {
                ]
            );
}
    };

if (hasPermission === null) {
    return (
        <View style={styles.container}>
            <Text>Solicitando permissão da câmera...</Text>
        </View>
    );
}

if (hasPermission === false) {
    return (
        <View style={styles.container}>
            <Text>Sem acesso à câmera</Text>
        </View>
    );
}

return (
    <View style={styles.container}>
        <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
                barcodeTypes: ['qr'],
            }}
        />
        <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.instructions}>
                Posicione o QR Code dentro da área
            </Text>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    instructions: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 8,
    },
});
