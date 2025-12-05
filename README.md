# Mobile App - Sistema de Controle de Higienização

Aplicativo mobile desenvolvido com React Native e Expo para registro de higienização de setores via QR Code e NFC/RFID.

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação entre telas
- **Expo Camera** - Scanner de QR Code
- **React Native NFC Manager** - Leitura de tags NFC/RFID
- **Axios** - Requisições HTTP
- **AsyncStorage** - Armazenamento local

## 📋 Pré-requisitos

- Node.js 18+
- Expo CLI
- Dispositivo físico ou emulador (Android/iOS)
- Para NFC: Dispositivo físico com chip NFC

## 🔧 Instalação

1. Instale as dependências:
```bash
cd mobile
npm install
```

2. Configure a URL da API:

Edite o arquivo `src/services/api.ts` e altere a `API_URL`:
```typescript
const API_URL = 'http://SEU-IP:3000'; // Ex: http://192.168.1.100:3000
```

## 🏃 Executando

### Desenvolvimento

```bash
# Iniciar o servidor Expo
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na web (limitado)
npm run web
```

### Testando no Dispositivo Físico

1. Instale o app **Expo Go** no seu dispositivo
2. Execute `npm start`
3. Escaneie o QR Code com o Expo Go

## 📱 Funcionalidades

### Autenticação
- Login com email e senha
- Armazenamento seguro de token JWT

### Scanner QR Code
- Leitura de QR Codes dos setores
- Feedback visual durante escaneamento
- Validação automática do código

### Leitor NFC/RFID
- Leitura de tags NFC/RFID
- Suporte para tags NDEF
- Feedback durante leitura

### Registro de Higienização
- Iniciar higienização ao escanear código
- Timer em tempo real
- Finalizar com observações opcionais
- Cálculo automático de duração

### Monitoramento
- Lista de higienizações em andamento
- Tempo decorrido em tempo real
- Finalização rápida

## 🔐 Permissões Necessárias

### Android
- `CAMERA` - Para escanear QR Codes
- `NFC` - Para ler tags NFC/RFID

### iOS
- Camera Usage - Para escanear QR Codes
- NFC Reader Usage - Para ler tags NFC

## 📦 Build para Produção

### Android (APK)

```bash
# Build de desenvolvimento
eas build --platform android --profile development

# Build de produção
eas build --platform android --profile production
```

### iOS (IPA)

```bash
# Build de desenvolvimento
eas build --platform ios --profile development

# Build de produção (requer conta Apple Developer)
eas build --platform ios --profile production
```

## 🛠️ Configuração EAS Build

1. Instale EAS CLI:
```bash
npm install -g eas-cli
```

2. Login no Expo:
```bash
eas login
```

3. Configure o projeto:
```bash
eas build:configure
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage
```

## 📝 Estrutura de Pastas

```
mobile/
├── src/
│   ├── navigation/      # Configuração de navegação
│   ├── screens/         # Telas do app
│   ├── services/        # API e storage
│   └── components/      # Componentes reutilizáveis
├── assets/              # Imagens e ícones
├── App.tsx              # Componente principal
└── app.json             # Configuração do Expo
```

## 🔄 Sincronização Offline

O app está preparado para funcionar offline:
- Armazenamento local de dados do usuário
- Fila de sincronização (a ser implementado)
- Reconexão automática

## 📱 Compatibilidade

- **Android**: 6.0 (API 23) ou superior
- **iOS**: 13.0 ou superior
- **NFC**: Requer hardware NFC no dispositivo

## 🐛 Troubleshooting

### Erro de permissão de câmera
- Verifique se as permissões estão configuradas no `app.json`
- Reinstale o app após adicionar permissões

### NFC não funciona
- Verifique se o dispositivo possui chip NFC
- Ative o NFC nas configurações do dispositivo
- Use um dispositivo físico (não funciona em emuladores)

### Erro de conexão com API
- Verifique se o backend está rodando
- Confirme o IP correto em `src/services/api.ts`
- Certifique-se de estar na mesma rede

## 📝 Licença

Proprietary
