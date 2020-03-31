import React from 'react'
import { View, Text } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'

const OnboardingScreen: React.FC = () => {
  return (
    <Onboarding
      pages={[
        {
          title: 'Groceries can be easy',
          subtitle:
            'Keep an organized list of the things you need in GroceryTime and become a rockstar at the supermarket.',
          backgroundColor: '#FFFFFF',
        },
        {
          title: 'Share your lists',
          subtitle:
            'Quickly share your lists with anyone you do groceries with. Simply invite them by email and the list will be shared!',
          backgroundColor: '#FFFFFF',
        },
        {
          title: 'Smart home powered',
          subtitle:
            'Use Siri, Amazon Alexa, and more to add items to your lists or review your lists using your voice.',
          backgroundColor: '#FFFFFF',
        },
      ]}
    />
  )
}
export default OnboardingScreen
