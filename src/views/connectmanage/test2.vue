
<template>
    <div class="test">
        <header>头部</header>
        <p>紧跟着的p</p>
        1111
        <a href="http://www.baidu.com">百度</a>
        <h1>222</h1>
        <h2>333</h2>
        <h3>4444</h3>
           
        <article>
            这是文本
            <section>
                这是什么东西
            </section>
            <nav>
                这个是nv
            </nav>
            <article>
                这是后面没的元素
            </article>
        </article>
        <div>
            这是间隔
        </div>
        <article>
            这是间隔后的文本
        </article>
    </div>
</template>
<script>
export default {
   data() {
      return {
      }
   },
   mounted() {
   },
   methods: {
   }
}
</script>
<style lang="scss" scoped>
 @import "src/styles/test.scss";
</style>
