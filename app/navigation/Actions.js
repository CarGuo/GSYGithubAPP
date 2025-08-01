/**
 * Actions compatibility layer
 * Provides react-native-router-flux Actions API using React Navigation
 */
import NavigationService from './NavigationService';

// Export NavigationService as Actions for backward compatibility
export const Actions = NavigationService;

// Also export specific router-flux compatible methods
export const Router = {
  // Legacy compatibility for Router usage
};

export const Scene = {
  // Legacy compatibility for Scene usage  
};

// Default export as Actions
export default NavigationService;