<template>
 <div class="container">
    <side-bar/>
    <div class="view-content">
      <header-bar/>
        <div class="main">
          <!-- id 不能删 -->
          <section class="view" id="view">
            <Breadcrumb></Breadcrumb>
            <div class="view-contain">
              <transition name="fade-transform" mode="out-in">
                <router-view/>
              </transition>
            </div>
            <Footer/>
          </section>
        </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/layout/HeaderBar'
import SideBar from '@/components/layout/SideBar'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Footer from '@/components/layout/Footer.vue'
export default {
  components: {
    HeaderBar,
    SideBar,
    Footer,
    Breadcrumb
  }
}
</script>

<style lang="scss">
// @import "../../assets/css/core";
// .container{
//   display: flex;
//   min-width: $global-width;
//   height: 100vh;
// }
</style>
