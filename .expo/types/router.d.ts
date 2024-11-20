/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/auth` | `/auth/Sign-in` | `/auth/Sign-up` | `/firebase` | `/screens` | `/screens/admin` | `/screens/booking` | `/screens/confirmation` | `/screens/payment` | `/screens/placeDetails` | `/screens/profileEdit` | `/tabs` | `/tabs/home` | `/tabs/location` | `/tabs/profile` | `/tabs/vehicle`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
