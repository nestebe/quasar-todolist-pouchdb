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


      <div class="list">
        <div :id="'test'+item.id" v-for="item in items" class="item">

          <i class="item-primary">lightbulb_outline</i>
          <div class="item-content has-secondary">
            <div>{{item.doc.task}}</div>
          </div>

          <div class="item-secondary">
            <i slot="target">
        more_vert
        <q-popover :ref="'popover'+item.id">
          <div class="list">
            <div class="item item-link" @click="$refs.popover.close()">
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


  import Quasar, { Utils, Dialog } from 'quasar'
  var PouchDB = require('pouchdb');
  export default {
    data() {
      return {
        items: [],
        db: null
      }
    },
    methods: {

      add() {
        var base = this
        Dialog.create({
          title: 'Prompt',
          form: {
            task: {
              type: 'textbox',
              label: 'My task',
              model: ''
            }
          },
          buttons: [
            'Cancel',
            {
              label: 'Add',
              handler(data) {
                base.db.post({
                  task: data.task
                }).then(function (response) {
                  // handle response
                  base.refresh();
                }).catch(function (err) {
                  console.log(err);
                });
              }
            }
          ]
        })
      },
      refresh() {
        this.db.allDocs({ include_docs: true }).then(function (result) {
          return result.rows;
        }).then(function (response) {
          this.items = response;
        }.bind(this)).catch(function (err) {
          console.error(err);
        });
    }
    },
  
    mounted() {
      this.db = new PouchDB('localdb');
      this.db.allDocs({ include_docs: true }).then(function (result) {
        return result.rows;
      }).then(function (response) {
        this.items = response;
        console.log(this.items);
      }.bind(this)).catch(function (err) {
        console.error(err);
      });

    },
    beforeDestroy() {

    }
  }
</script>