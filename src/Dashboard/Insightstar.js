import React, { Component } from 'react';

import { Text, Image, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';


class Insightstar extends Component {
 
    constructor(props) {
      super(props);
      this.state = {
        starCount: 4.5
      };
    }
   
    onStarRatingPress(rating) {
      this.setState({
        starCount: rating
      });
    }
   render() {
      return (
        <StarRating
          disabled={false}
          emptyStar={'star-border'}
          fullStar={'star'}
          halfStar={'star-half'}
          iconSet={'MaterialIcons'}
          maxStars={5}
          starSize={19}
          rating={this.state.starCount}
          selectedStar={(rating) => this.onStarRatingPress(rating)}
          fullStarColor={'#f8b42b'}
        />
      );
    }
  }
  export default Insightstar;
   
  