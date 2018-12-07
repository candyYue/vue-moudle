<template>
  <div class="view-content">
    <header-bar :toggle='isToggle' :theme='themeColor'/>
    <div class="main">
      <sub-side-bar class="enterprise-side" :navTitle="navTitle" :navRouter="navRouter" style="width:200px"/>
      <section class="view enterprise-view">
        <div class="view-contain">
          <router-view/>
        </div>
        <Footer/>
      </section>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/layout/HeaderBar.vue'
import Footer from '@/components/layout/Footer.vue'
import SubSideBar from '@/components/layout/SubSideBar.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'admin-view',
  components: {
    HeaderBar,
    SubSideBar,
    Footer
  },
  data () {
    return {
      themeColor: 'dark',
      isToggle: true,
      navTitle: '企业列表',
      navRouter: []
    }
  },
  computed: {
    ...mapGetters({
      AllEsTotalList: 'Admin/AllEsTotalList'
    })
  },
  methods: {
    ...mapActions({
      getAllEs: 'Admin/getAllEs'
    })
  },
  mounted () {
    this.getAllEs().then(_ => {
      this.AllEsTotalList.map(v => {
        this.navRouter.push({
          name: v.name,
          key: 'AdminList',
          params: {
            id: v.id
          }
        })
      })
      if (!this.$route.params.id) {
        this.$router.push({ name: 'Admin-List', params: { id: this.AllEsTotalList[0].id } })
      }
    })
  }
}
</script>

<style scoped>
.navgation ul li{
  padding-left:33px
}
</style>
