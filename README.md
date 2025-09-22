This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Prerequisites

## Node.js Version Requirements

⚠️ **Important**: This project requires Node.js v18 or v20 (LTS versions). Node.js v23+ may cause native dependency compilation issues.

### Recommended Setup with nvm

```bash
# Install nvm if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Restart your terminal or run:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use Node.js v20 LTS
nvm install 20
nvm use 20
nvm alias default 20
```

## Dependencies

This project uses several native dependencies that require proper compilation:
- `react-native-leveldb` - LevelDB database for React Native
- `react-native-quick-crypto` - Crypto operations
- `react-native-reanimated` - Advanced animations
- OrbitDB and libp2p libraries for decentralized functionality

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# Make sure you're using Node.js v20
nvm use 20

# Install dependencies (required for first setup or after updates)
npm install --legacy-peer-deps
```


```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

## Common Build Issues

### Node.js Version Issues
If you encounter native dependency compilation errors (especially with CMake or `node-datachannel`):

```bash
# Switch to Node.js v20 LTS
nvm use 20

# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Clean Android build cache
cd android && ./gradlew clean && cd ..
```

### React Native Reanimated Version Error
If you see: `[Reanimated] Unsupported React Native version. Please use 78. or newer.`

This has been resolved by updating to React Native 0.81.4. Make sure you're using the latest dependencies.

### CMake Build Failures
If you encounter ARM64 CMake compilation errors:

1. Ensure you're using Node.js v20 (not v23+)
2. Make sure Xcode command line tools are installed: `xcode-select --install`
3. Clean build directories: `rm -rf android/app/.cxx`

### Gradle Version Issues
If you see: `Minimum supported Gradle version is 8.13`:

This has been resolved by updating the Gradle wrapper to version 8.13.

## Version Information

This project uses:
- **React Native**: 0.81.4
- **React**: ^19.1.0  
- **Node.js**: v20 LTS (recommended)
- **Gradle**: 8.13
- **Android NDK**: 26.1.10909125

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
# cyberfly-libp2p-react-native

A React Native application integrating OrbitDB and libp2p for decentralized functionality.

## Key Features

- **Decentralized Database**: Uses OrbitDB for peer-to-peer database operations
- **libp2p Integration**: Implements libp2p networking stack for P2P communications
- **Native Performance**: Leverages native modules for crypto operations and database storage
- **Cross-Platform**: Supports both Android and iOS platforms

## Architecture

This app uses several key technologies:
- **OrbitDB**: Decentralized database built on IPFS
- **libp2p**: Modular network stack for P2P applications  
- **LevelDB**: Fast key-value storage for local data
- **React Native Crypto**: Hardware-accelerated cryptographic operations
