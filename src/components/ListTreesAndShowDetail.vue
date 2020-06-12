<template>
  <v-container>
      <v-card v-if="!showDetail">
        <v-card-title>Arbres Remarquables de Paris <v-icon meduim right>mdi-pine-tree</v-icon>
          <v-spacer></v-spacer>
          <v-text-field append-icon="mdi-magnify" label="Search"
              single-line    hide-details @input="searchWord" v-model="wordTosearch"  ></v-text-field>
        </v-card-title>

        <!-- Filters -->
      <v-expansion-panels v-model="filtersPanel">
        <v-expansion-panel>
          <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4"><v-icon left large>mdi-filter</v-icon>Filters</v-col>
                <v-col cols="8"  class="text--secondary" >
                  <v-fade-transition leave-absolute>
                    <span  v-if="open"   key="0">Select Filters</span>
                    <span v-else  key="1">
                      <v-chip v-if="selectedGenre!=null">{{ selectedGenre }}</v-chip>
                      <v-chip v-if="selectedEspece!=null">{{ selectedEspece }}</v-chip>
                      <v-chip v-if="selectedLibellefrancais!=null">{{ selectedLibellefrancais }}</v-chip>
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="4">
                <v-select v-model="selectedGenre" item-text="name" item-value="path" deletable-chips label="Genre"  :items="genres" chips flat solo></v-select>
              </v-col>
              <v-col cols="4">
                <v-select v-model="selectedEspece" item-text="name" item-value="path" deletable-chips label="Espece"  :items="especes" chips flat solo></v-select>
              </v-col>
              <v-col cols="4">
                <v-select v-model="selectedLibellefrancais" item-text="name" item-value="path" deletable-chips label="Libelle Français"  :items="libellesfrancais" chips flat solo></v-select>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>              
              <v-btn ext color="secondary" @click="removeFilters"><v-icon small left >mdi-filter-remove</v-icon> Remove Filters</v-btn>
              <v-btn ext color="secondary" @click="applyFilters">Apply</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

        <v-data-table  :items="trees" :headers="headers" :items-per-page="itemsPerPage"  fixed-header 
        height="500px"  @click:row="getDetail" :search="search" 
        :custom-filter="customFilter" :hide-default-footer="hideFooter"  class="table-row"> </v-data-table>
        <v-pagination :length="lengthOfPages" v-model="page" @input="getPageNumberOf">  
        </v-pagination>
      </v-card>
    <div v-else>
      <v-card>
        <v-card-title>Details</v-card-title>
        <v-simple-table dense="showDetail">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Fields</th>
                  <th class="text-left">Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Libelle Francais</td>
                  <td>{{ tree.libellefrancais }}</td>
                </tr>
                <tr>
                  <td>Arrondissement</td>
                  <td>{{ tree.arrondissement }}</td>              
                </tr>
                <tr>
                  <td>Circonférence en cm</td>
                  <td>{{  tree.circonferenceencm }}</td>                 
                </tr>
                <tr>
                  <td>Hauteur en mètre</td>
                  <td>{{ tree.hauteurenm }}</td>                 
                </tr>
                <tr>
                  <td>Espece</td>
                  <td>{{ tree.espece }}</td>                 
                </tr>
                <tr>
                  <td>Adresse</td>
                  <td>{{ tree.adresse }}</td>                 
                </tr>
                <tr>
                  <td>Domanialité</td>
                  <td>{{ tree.domanialite  }}</td>                 
                </tr>
                <tr>
                  <td>Stade de Developpement</td>
                  <td>{{ tree.stadedeveloppement }}</td>                 
                </tr>
                <tr>
                  <td>Genre</td>
                  <td>{{ tree.genre }}</td>                 
                </tr>
                <tr>
                  <td>Date de Plantation</td>
                  <td>{{ tree.dateplantation }}</td>                 
                </tr>
              </tbody>
            </template>
        </v-simple-table>
      </v-card>
      <v-btn class="mt-3" v-on:click="showDetail=false"> <v-icon small left >mdi-arrow-left-bold</v-icon>Return</v-btn>
    </div>
  </v-container>
</template>

<script>
  export default {
    name: 'ListTreesAndShowDetail',

    data: () => ({
       count:0,
      headers:[
        { text: 'IDBASE', value: 'fields.idbase' },
        { text: 'Genre', value: 'fields.genre' },
        { text: 'Espece', value: 'fields.espece' },
        { text: 'Libelle Français', value: 'fields.libellefrancais' }
      ],
      itemsPerPage:25,
      page:1,   // The First page in the navigation bar to be selected
      lengthOfPages:1,
      showDetail:false,
    // Object for the Tree information : 
      tree: {
            libellefrancais:'',
            arrondissement:'',
            circonferenceencm:0.0,
            hauteurenm:0,
            espece:'',
            adresse:'',
            domanialite:'',
            stadedeveloppement:'',
            genre:'',
            dateplantation:'',
          },
          trees:[],
          start:0,
          sortedBy:'idbase',
          genres:[],
          especes:[],
          libellesfrancais:[],
          selectedGenre:null,
          selectedEspece:null,
          selectedLibellefrancais:null,
          filtersPanel:[],
          search:'0', // The attribute is used juste to triger the customFilter function.
          hideFooter:true,
          wordTosearch:'' // This attribute is used for search.
      }),

      methods: {
      getData: function() {
        let url = "https://parisdata.opendatasoft.com/api/records/1.0/search/?dataset=arbresremarquablesparis"
        +"&q="+this.wordTosearch
        +"&rows=25" // IF The number of rows in the request > rows in the real data: No Problem according to API Docs.
        +"&start="+this.start
        +"&sort="+this.sortedBy;
        this.$http.get(url).then(function(response){
        this.trees=response.body.records;
        this.lengthOfPages = parseInt(response.body.nhits/25); // The number of page, one page is 25 rows/page
        if(response.body.nhits%25!=0) this.lengthOfPages+=1; 
        console.log("Number of Rows= "+response.body.nhits);

        });
       
  },

  // Show Detail for a Tree : 
  getDetail: function (selectedTree) {
    console.log(selectedTree['recordid']);
    let url = 'https://parisdata.opendatasoft.com/api/datasets/1.0/arbresremarquablesparis/records/'+selectedTree['recordid'];
    this.$http.get(url).then(function(response){
      this.tree.libellefrancais = response.body.fields.libellefrancais;
      this.tree.arrondissement = response.body.fields.arrondissement;
      this.tree.circonferenceencm = response.body.fields.circonferenceencm;
      this.tree.hauteurenm = response.body.fields.hauteurenm;
      this.tree.espece = response.body.fields.espece;
      this.tree.adresse = response.body.fields.adresse;
      this.tree.domanialite = response.body.fields.domanialite;
      this.tree.stadedeveloppement = response.body.fields.stadedeveloppement;
      this.tree.genre = response.body.fields.genre;
      this.tree.dateplantation = response.body.fields.dateplantation;

      this.showDetail=true;
    })
  },
  applyFilters: function () {
    this.filtersPanel=[];
    this.search=='0' ? this.search='1' : this.search='0' ; // Trigger customFilter Function.

  },
  // We use this function to filter genre, espece, and libellefrancais
  customFilter: function (value, search, item) {

    return (
          ( (this.selectedGenre==null)||(item['fields']['genre']==this.selectedGenre) ) &&
          ( (this.selectedEspece==null)||(item['fields']['espece']==this.selectedEspece) ) &&
          ( (this.selectedLibellefrancais==null)||(item['fields']['libellefrancais']==this.selectedLibellefrancais) ) 
          )
  },
  removeFilters: function () {
    this.filtersPanel=[];
    this.selectedGenre = null;
    this.selectedEspece = null;
    this.selectedLibellefrancais=null;
    this.getData(); 
  }, 
  getPageNumberOf(){
    this.start = (this.page-1)*25;
    this.getData();
},
  searchWord(){
    this.getData(this.wordTosearch);
  }
  },    

// Fetching Data when the component is created
created(){
  // Get Genre, Especes, and Libellefrancais  :
  let url = 'https://parisdata.opendatasoft.com/api/records/1.0/search/?rows=0&facet=genre&facet=espece&facet=libellefrancais&dataset=arbresremarquablesparis';
  this.$http.get(url).then(function(response){
    this.genres = response.body.facet_groups[0].facets; // Genres
    this.especes = response.body.facet_groups[1].facets; // Especes
    this.libellesfrancais = response.body.facet_groups[2].facets; // Libellefrancais
  });
  // Retrieve The List of Trees 
  this.getData();
}
}
</script>
<style scoped>
.table-row{
  cursor: pointer;
}
</style>