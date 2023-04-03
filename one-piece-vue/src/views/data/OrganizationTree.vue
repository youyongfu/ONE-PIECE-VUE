<template>
    <div class="margin2">
        <template v-for="(item,index) in children">
            <el-option :label="item.name" :value="item.id" :key="item.name"></el-option>
            <OrganizationTree :children="item.children" :key="index" v-if="item.children"/>
        </template>
    </div>
</template>

<script>

    export default {
        name: "OrganizationTree",//必须要 递归组件的关键，并且要与引入组件的变量名称一致
        components: {

        },
        props: {
            children: {}
        }
    };
</script>

<style scoped>

    .margin2{
        margin-left:2vh
    }
</style>