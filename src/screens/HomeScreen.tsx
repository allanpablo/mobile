import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import { storage } from '../services/storage';
import { higienizacaoService } from '../services/api';

export default function HomeScreen({ navigation }: any) {
    const [user, setUser] = useState<any>(null);
    const [emAndamento, setEmAndamento] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUser();
        loadEmAndamento();
    }, []);

    const loadUser = async () => {
        const userData = await storage.getUser();
        setUser(userData);
    };

    const loadEmAndamento = async () => {
        setLoading(true);
        try {
            const data = await higienizacaoService.emAndamento();
            const meusRegistros = data.filter((r: any) => r.usuarioId === user?.id);
            setEmAndamento(meusRegistros);
        } catch (error) {
            console.error('Erro ao carregar registros:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert('Sair', 'Deseja realmente sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                onPress: async () => {
                    await storage.clear();
                    navigation.replace('Login');
                },
            },
        ]);
    };

    const formatDuration = (inicio: string) => {
        const start = new Date(inicio);
        const now = new Date();
        const diff = Math.floor((now.getTime() - start.getTime()) / 60000);
        return `${diff} min`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Olá, {user?.nome}</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => navigation.navigate('Scanner')}
                >
                    <Text style={styles.scanButtonText}>📷 Escanear QR Code</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.nfcButton}
                    onPress={() => navigation.navigate('NFCReader')}
                >
                    <Text style={styles.nfcButtonText}>📱 Ler NFC/RFID</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Higienizações em Andamento</Text>

            {emAndamento.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma higienização em andamento</Text>
            ) : (
                <FlatList
                    data={emAndamento}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }: { item: any }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{item.setor.nome}</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>Em andamento</Text>
                                </View>
                            </View>
                            <Text style={styles.cardSubtitle}>{item.setor.localizacao}</Text>

                            <View style={styles.cardFooter}>
                                <Text style={styles.cardTime}>
                                    Iniciado às {new Date(item.inicioEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                                <TouchableOpacity
                                    style={styles.cardButton}
                                    onPress={() => navigation.navigate('Higienizacao', { setor: item.setor, higienizacaoId: item.id })}
                                >
                                    <Text style={styles.cardButtonText}>Continuar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
    },
    buttonContainer: {
        marginBottom: 30,
    },
    scanButton: {
        backgroundColor: '#007AFF',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nfcButton: {
        backgroundColor: '#34C759',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    nfcButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    badge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: '#1E40AF',
        fontSize: 12,
        fontWeight: '600',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    cardTime: {
        fontSize: 14,
        color: '#4B5563',
    },
    cardButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    cardButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    finishButton: {
        backgroundColor: '#34C759',
        padding: 10,
        borderRadius: 6,
        marginTop: 10,
        alignItems: 'center',
    },
    finishButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
