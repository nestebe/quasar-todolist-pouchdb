<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        My Todo
      </q-toolbar-title>
      <button @click="add">
        <i>add</i>
      </button>
    </div>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <div class="layout-view">

      <q-search @input="search" v-model="searchModel"></q-search>


      <div class="list">
        <div :id="'test'+item._id" v-for="(item, index) in items" v-bind:key="index" class="item">

          <i class="item-primary">lightbulb_outline</i>
          <div class="item-content has-secondary">
            <div>{{item.task}}</div>
          </div>

          <div class="item-secondary">
            <i slot="target">
              more_vert
              <q-popover :ref="'popover'">
                <div class="list">
                  <div class="item item-link" @click="deleteItem(item._id, index)">
                    <div class="item-content">Delete</div>
                  </div>
                </div>
              </q-popover>
            </i>
          </div>
        </div>

      </div>
    </div>
  </q-layout>
</template>

<script>
  import Quasar, { Utils, Dialog } from "quasar";
  var PouchDB = require("pouchdb");
 // PouchDB.plugin(require("pouchdb-find"));

  export default {
    data() {
      return {
        items: [],
        db: null,
        searchModel: ""
      };
    },
    methods: {
      add() {
        var base = this;
        Dialog.create({
          title: "New task",
          form: {
            task: {
              type: "textbox",
              label: "My task",
              model: ""
            }
          },
          buttons: [
            "Cancel",
            {
              label: "Add",
              handler(data) {
                base.db
                  .post({
                    task: data.task
                  })
                  .then(function (response) {
                    // handle response
                    base.search();
                    console.log(response);
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
              }
            }
          ]
        });
      },
      search() {
        console.log(this.searchModel);
        var base = this;

        this.db
          .find({
            //include_docs: true,
            selector: { task: { $regex: base.searchModel } }
            //  fields: ['task']
          })
          .then(function (result) {
            // yo, a result
            console.log(result);

            base.items = result.docs;
          })
          .catch(function (err) {
            // ouch, an error
            console.log(err);
          });
      },
      deleteItem(idItem, index) {
        this.$refs.popover[0].close(index);
        var base = this;
        base.db.get(idItem).then(function (doc) {
          base.db.remove(doc);
          base.search();
        });
      }
    },

    mounted() {
      this.db = new PouchDB("localdb");

      //index for search
      this.db.createIndex({
        index: {
          fields: ["task"]
        }
      });

      this.search();
    },
    beforeDestroy() { }
  };
</script>