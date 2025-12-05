import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { higienizacaoService } from '../services/api';

export default function HigienizacaoScreen({ route, navigation }: any) {
    const { setor, codigo, registro } = route.params || {};
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentRegistro, setCurrentRegistro] = useState(registro);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (currentRegistro) {
            const interval = setInterval(() => {
                const start = new Date(currentRegistro.inicioEm);
                const now = new Date();
                const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
                setTimer(diff);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentRegistro]);

    const handleIniciar = async () => {
        setLoading(true);
        try {
            const response = await higienizacaoService.iniciar(codigo);
            setCurrentRegistro(response);
            Alert.alert('Sucesso', 'Higienização iniciada!');
        } catch (error: any) {
            Alert.alert(
                'Erro',
                error.response?.data?.message || 'Erro ao iniciar higienização'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizar = async () => {
        if (!currentRegistro) return;

        if (!observacoes.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Atenção',
                text2: 'Por favor, adicione observações sobre a higienização.',
            });
            return;
        }

        setLoading(true);
        try {
            await higienizacaoService.finalizar(currentRegistro.id, observacoes);
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Higienização finalizada com sucesso!',
            });
            navigation.navigate('Home');
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: error.response?.data?.message || 'Erro ao finalizar higienização',
            });
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {setor?.nome || currentRegistro?.setor?.nome}
                </Text>
                <Text style={styles.subtitle}>
                    {setor?.localizacao || currentRegistro?.setor?.localizacao || 'Sem localização'}
                </Text>
            </View>

            {currentRegistro ? (
                <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>Tempo decorrido</Text>
                    <Text style={styles.timer}>{formatTime(timer)}</Text>
                </View>
            ) : null}

            <View style={styles.form}>
                <Text style={styles.label}>Observações (opcional)</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Adicione observações sobre a higienização..."
                    value={observacoes}
                    onChangeText={setObservacoes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>

            {currentRegistro ? (
                <TouchableOpacity
                    style={[styles.button, styles.finishButton, loading && styles.buttonDisabled]}
                    onPress={handleFinalizar}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Finalizar Higienização</Text>
                    )}
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[styles.button, styles.startButton, loading && styles.buttonDisabled]}
                    onPress={handleIniciar}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Iniciar Higienização</Text>
                    )}
                </TouchableOpacity>
            )}

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
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginTop: 40,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    timerContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#FF9500',
    },
    timerLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    timer: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FF9500',
        fontVariant: ['tabular-nums'],
    },
    form: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    textArea: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        minHeight: 100,
    },
    button: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
    },
    startButton: {
        backgroundColor: '#34C759',
    },
    finishButton: {
        backgroundColor: '#FF9500',
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
        padding: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontSize: 16,
    },
});
