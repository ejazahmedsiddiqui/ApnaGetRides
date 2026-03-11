import Reactotron from 'reactotron-react-native';

Reactotron
    .configure({name: 'ApnaGetRide'})
    .useReactNative()
    .connect();
declare global {
    interface Console {
        tron: typeof Reactotron;
    }
}
console.tron = Reactotron;