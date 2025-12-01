import { Game } from "@/types/betting";

export const SAMPLE_GAMES: Game[] = [
  {
    id: 1,
    time: "8:30 PM EST Tonight",
    teams: ["Philadelphia Eagles", "Dallas Cowboys"],
    odds: ["+145", "-165"],
    type: "NFL",
    playerProps: [
      {
        id: 1,
        player: "Jalen Hurts",
        stat: "Passing Yards",
        line: 255.5,
        overOdds: "+110",
        underOdds: "-130"
      },
      {
        id: 2,
        player: "Dak Prescott",
        stat: "Passing Yards",
        line: 270.5,
        overOdds: "-115",
        underOdds: "-105"
      },
      {
        id: 3,
        player: "Ezekiel Elliott",
        stat: "Rushing Yards",
        line: 75.5,
        overOdds: "+105",
        underOdds: "-125"
      },
      {
        id: 4,
        player: "CeeDee Lamb",
        stat: "Receiving Yards",
        line: 85.5,
        overOdds: "-110",
        underOdds: "-110"
      }
    ]
  },
  {
    id: 2,
    time: "10:00 PM EST Tonight",
    teams: ["Los Angeles Lakers", "Boston Celtics"],
    odds: ["-120", "+100"],
    type: "NBA",
    playerProps: [
      {
        id: 5,
        player: "LeBron James",
        stat: "Points",
        line: 27.5,
        overOdds: "-115",
        underOdds: "-105"
      },
      {
        id: 6,
        player: "Jayson Tatum",
        stat: "Points",
        line: 28.5,
        overOdds: "+100",
        underOdds: "-120"
      },
      {
        id: 7,
        player: "Anthony Davis",
        stat: "Rebounds",
        line: 11.5,
        overOdds: "-110",
        underOdds: "-110"
      }
    ]
  },
  {
    id: 3,
    time: "9:30 PM EST Tonight",
    teams: ["Golden State Warriors", "Miami Heat"],
    odds: ["-140", "+120"],
    type: "NBA",
    playerProps: [
      {
        id: 8,
        player: "Stephen Curry",
        stat: "Points",
        line: 29.5,
        overOdds: "-105",
        underOdds: "-115"
      },
      {
        id: 9,
        player: "Jimmy Butler",
        stat: "Assists",
        line: 6.5,
        overOdds: "+110",
        underOdds: "-130"
      }
    ]
  },
  {
    id: 4,
    time: "1:05 PM EST Tomorrow",
    teams: ["New York Yankees", "Boston Red Sox"],
    odds: ["-135", "+115"],
    type: "MLB",
    playerProps: [
      {
        id: 10,
        player: "Aaron Judge",
        stat: "Home Runs",
        line: 0.5,
        overOdds: "+250",
        underOdds: "-350"
      }
    ]
  },
  {
    id: 5,
    time: "3:00 PM EST Tomorrow",
    teams: ["Manchester City", "Arsenal"],
    odds: ["-110", "+300"],
    type: "Soccer",
    playerProps: [
      {
        id: 11,
        player: "Erling Haaland",
        stat: "Goals",
        line: 0.5,
        overOdds: "-130",
        underOdds: "+100"
      }
    ]
  },
  {
    id: 6,
    time: "7:30 PM EST Tonight",
    teams: ["Tampa Bay Lightning", "Florida Panthers"],
    odds: ["+110", "-130"],
    type: "NHL",
    playerProps: [
      {
        id: 12,
        player: "Connor McDavid",
        stat: "Points",
        line: 1.5,
        overOdds: "+120",
        underOdds: "-150"
      }
    ]
  }
];
