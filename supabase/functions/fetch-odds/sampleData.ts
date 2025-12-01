
// Sample API response for development and fallback
export const SAMPLE_API_RESPONSE = [
  {
    id: "1",
    sport_key: "americanfootball_nfl",
    sport_title: "NFL",
    commence_time: new Date(Date.now() + 3600000).toISOString(),
    home_team: "Philadelphia Eagles",
    away_team: "Dallas Cowboys",
    bookmakers: [{
      key: "fanduel",
      markets: [{
        key: "h2h",
        outcomes: [
          { name: "Philadelphia Eagles", price: 150 },
          { name: "Dallas Cowboys", price: -175 }
        ]
      }, {
        key: "spreads",
        outcomes: [
          { name: "Philadelphia Eagles", price: -110, point: 3.5 },
          { name: "Dallas Cowboys", price: -110, point: -3.5 }
        ]
      }, {
        key: "player_passing_yards",
        outcomes: [
          { name: "Jalen Hurts", price: -110, point: 255.5, description: "Jalen Hurts" },
          { name: "Under", price: -110, point: 255.5, description: "Jalen Hurts" }
        ]
      }, {
        key: "player_rushing_yards",
        outcomes: [
          { name: "Jalen Hurts", price: -115, point: 45.5, description: "Jalen Hurts" },
          { name: "Under", price: -105, point: 45.5, description: "Jalen Hurts" }
        ]
      }]
    }]
  },
  {
    id: "2",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: new Date(Date.now() + 7200000).toISOString(),
    home_team: "Los Angeles Lakers",
    away_team: "Boston Celtics",
    bookmakers: [{
      key: "draftkings",
      markets: [{
        key: "h2h",
        outcomes: [
          { name: "Los Angeles Lakers", price: -120 },
          { name: "Boston Celtics", price: 110 }
        ]
      }, {
        key: "spreads",
        outcomes: [
          { name: "Los Angeles Lakers", price: -110, point: -1.5 },
          { name: "Boston Celtics", price: -110, point: 1.5 }
        ]
      }, {
        key: "player_points",
        outcomes: [
          { name: "LeBron James", price: -115, point: 28.5, description: "LeBron James" },
          { name: "Under", price: -105, point: 28.5, description: "LeBron James" }
        ]
      }, {
        key: "player_rebounds",
        outcomes: [
          { name: "Anthony Davis", price: -120, point: 12.5, description: "Anthony Davis" },
          { name: "Under", price: -110, point: 12.5, description: "Anthony Davis" }
        ]
      }]
    }]
  },
  {
    id: "3",
    sport_key: "baseball_mlb",
    sport_title: "MLB",
    commence_time: new Date(Date.now() + 86400000).toISOString(),
    home_team: "New York Yankees",
    away_team: "Boston Red Sox", 
    bookmakers: [{
      key: "betmgm",
      markets: [{
        key: "h2h",
        outcomes: [
          { name: "New York Yankees", price: -135 },
          { name: "Boston Red Sox", price: 125 }
        ]
      }, {
        key: "spreads",
        outcomes: [
          { name: "New York Yankees", price: -110, point: -1.5 },
          { name: "Boston Red Sox", price: -110, point: 1.5 }
        ]
      }, {
        key: "player_strikeouts",
        outcomes: [
          { name: "Gerrit Cole", price: -115, point: 7.5, description: "Gerrit Cole" },
          { name: "Under", price: -105, point: 7.5, description: "Gerrit Cole" }
        ]
      }]
    }]
  },
  {
    id: "4",
    sport_key: "soccer_epl",
    sport_title: "EPL",
    commence_time: new Date(Date.now() + 172800000).toISOString(),
    home_team: "Manchester United",
    away_team: "Liverpool",
    bookmakers: [{
      key: "caesars",
      markets: [{
        key: "h2h",
        outcomes: [
          { name: "Manchester United", price: 165 },
          { name: "Liverpool", price: -150 }
        ]
      }, {
        key: "spreads",
        outcomes: [
          { name: "Manchester United", price: -110, point: 0.5 },
          { name: "Liverpool", price: -110, point: -0.5 }
        ]
      }]
    }]
  }
];
