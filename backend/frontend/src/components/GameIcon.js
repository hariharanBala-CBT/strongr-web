// File: d:/str/strongr-web/backend/frontend/src/components/GameIcon.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableTennis,
  faVolleyball,
  faFootballBall,
  faBaseballBall,
  faHockeyPuck,
  faGolfBall,
  faDumbbell,
  faRunning,
  faSwimmer,
  faBiking,
  faBullseye,
  faPersonRifle,
  faFutbol,
} from '@fortawesome/free-solid-svg-icons';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
// import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsCricketTwoToneIcon from '@mui/icons-material/SportsCricketTwoTone';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import SportsRugbyIcon from '@mui/icons-material/SportsRugby';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
// import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const gameIcons = {
  'Soccer': <SportsSoccerIcon />,
  'Football': <FontAwesomeIcon icon={faFootballBall} />,
  'Basketball': <SportsBasketballIcon />,
  'Tennis': <SportsTennisIcon />,
  'Table Tennis': <FontAwesomeIcon icon={faTableTennis} />,
  'Badminton': <SportsTennisIcon />,
  'Cricket': <SportsCricketTwoToneIcon />,
  'Volleyball': <FontAwesomeIcon icon={faVolleyball} />,
  'Baseball': <FontAwesomeIcon icon={faBaseballBall} />,
  'Hockey': <FontAwesomeIcon icon={faHockeyPuck} />,
  'Golf': <FontAwesomeIcon icon={faGolfBall} />,
  'Rugby': <SportsRugbyIcon />,
  'Handball': <SportsHandballIcon />,
  'Kabaddi': <SportsKabaddiIcon />,
  'MMA': <SportsMmaIcon />,
  'Boxing': <SportsMmaIcon />,
  'Wrestling': <SportsKabaddiIcon />,
  'Gym': <FontAwesomeIcon icon={faDumbbell} />,
  'Running': <FontAwesomeIcon icon={faRunning} />,
  'Swimming': <FontAwesomeIcon icon={faSwimmer} />,
  'Cycling': <FontAwesomeIcon icon={faBiking} />,
  'Futsal': <FontAwesomeIcon icon={faFutbol} />,
  'E-sports': <SportsEsportsIcon />,
  'Gun Range': <FontAwesomeIcon icon={faPersonRifle} />,
  'Archery': <FontAwesomeIcon icon={faBullseye} />
};

const GameIcon = ({ game, className = '' }) => {
  const icon = gameIcons[game];
  if (icon) {
    return React.cloneElement(icon, { className: `game-icon ${className}` });
  }
  return <span className={`game-name ${className}`}>{game}</span>;
};

export default GameIcon;