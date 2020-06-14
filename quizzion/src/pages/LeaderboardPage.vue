<template>
    <q-page class="flex flex-center">
        <leaderboard-component :userId="usrId" :titleData="ttlData" :userData="usrData" :colorData="clrData"></leaderboard-component>
        <mini-leaderboard-component :titleData="ttlData" :userData="usrData" :colorData="clrData"></mini-leaderboard-component>
    </q-page>
</template>

<script>
import LeaderboardComponent from '../components/charts/LeaderboardComponent'
import MiniLeaderboardComponent from '../components/charts/MiniLeaderboardComponent'
export default {
  name: 'LeaderboardPage',
  components: {
    LeaderboardComponent,
    MiniLeaderboardComponent,
  },
  data () {
    return {
      usrId: 6,
      ttlData: "Quiz Ranking",
      clrData: {
        transparent: "rgb(255,255,255, 1)",

        firstPlace: "rgb(241, 244, 58, 0.9)",
        firstPlaceBorder: "rgb(241, 244, 58)",
        firstPlaceText: "rgb(203, 207, 35)",

        secondPlace: "rgb(196, 196, 196, 0.9)",
        secondPlaceBorder: "rgb(196, 196, 196)",
        secondPlaceText: "rgb(153, 153, 153)",

        thirdPlace: "rgb(198, 170, 85, 0.9)",
        thirdPlaceBorder: "rgb(198, 170, 85)",
        thirdPlaceText: "rgb(171, 148, 79)"
      },
      usrData: [
        {
          id: 1,
          username: "User 1",
          score: 100
        },
        {
          id: 2,
          username: "User 2",
          score: 80
        },
        {
          id: 3,
          username: "User 3",
          score: 70
        },
        {
          id: 4,
          username: "User 4",
          score: 60
        },
        {
          id: 5,
          username: "User 5",
          score: 50
        },
        {
          id: 6,
          username: "User 6",
          score: 40
        },
        {
          id: 7,
          username: "User 7",
          score: 30
        },
        {
          id: 8,
          username: "User 8",
          score: 20
        },
        {
          id: 9,
          username: "User 9",
          score: 10
        }
      ]
    }
  }
}
</script>
