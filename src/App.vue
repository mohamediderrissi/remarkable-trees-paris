<template>
  <v-app>
<v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link @click="sourceCode">
          <v-list-item-action>
            <span><v-icon>mdi-github</v-icon></span>
            </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Source Code</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  <v-app-bar  app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col >
            <v-content>
              <ListTreesAndShowDetail />
            </v-content>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2020</span>
    </v-footer>
           
  </v-app>

</template>

<script>
import ListTreesAndShowDetail from './components/ListTreesAndShowDetail';

export default {
  name: 'App',

  components: {
    ListTreesAndShowDetail,
  },

  data: () => ({
    drawer: false,
  }),
  methods: { 
    sourceCode(){
      console.log('clicked');
      window.location.href = "https://github.com/mohamediderrissi/remarkable-trees-paris";
    }
  }
  
};
</script>
