/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Run from 'thitracnghiem/Navigation/Export';
import { name as appName } from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(Run));
