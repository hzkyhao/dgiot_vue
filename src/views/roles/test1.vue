<template>
  <div class>
    <button @click="add">新增</button>
    <button @click="addmenu">新增1111</button>
  </div>
</template>
<script>
import { Parse } from 'parse'
import { args } from 'args'
export default {
  data() {
    return {

    }
  },
  mounted() {

    // this.checkSetup();
  },
  methods: {
    checkSetup() {
      return new Promise((resolve, reject) => {
        const role = new Parse.Query(Parse.Role)
        role.equalTo('name', 'root')
        role
          .count({ useMasterKey: true })
          .then(count =>
            count ? reject('数据已初始化，请勿重复操作') : resolve()
          )
          .catch(() => resolve())
      })
    },
    add() {
      const roleACL = new Parse.ACL()
      roleACL.setReadAccess(Parse.User.current(), true)
      roleACL.setWriteAccess(Parse.User.current(), true)
      roleACL.setPublicReadAccess(true)
      const role = new Parse.Role('root', roleACL)
      role.set('alias', '超级管理员')
      role.getUsers().add(Parse.User.current())
      return role.save(null, { useMasterKey: false })
    },
    getACL(roles) {
      const acl = new Parse.ACL()
      acl.setRoleReadAccess('root', true)
      acl.setRoleWriteAccess('root', true)
      roles.forEach(role => {
        if (role == 'public') {
          acl.setPublicReadAccess(true)
        } else {
          acl.setRoleReadAccess(role, true)
        }
      })
      return acl
    },
    addmenu() {
      const ROLES = new Map()
      const menus = this.data.menu.map(menu => {
        menu.acl = menu.acl || ['root']
        const Menu = Parse.Object.extend('Menu')
        const object = new Menu()
        const roles = object.relation('roles')
        menu.acl.forEach(x => {
          if (ROLES.has(x)) {
            roles.add(ROLES.get(x))
          }
        })
        object.setACL(this.getACL(menu.acl))
        object.set('group', menu.group)
        object.set('name', menu.name)
        if (menu.orderBy) object.set('orderBy', menu.orderBy)
        if (menu.url) object.set('url', menu.url)
        if (menu.icon) object.set('icon', menu.icon)
        // object.save(null,{useMasterKey: false})
        return object
      })
      return Parse.Object.saveAll(menus, { useMasterKey: false })
    }
  }
}
</script>
<style scoped>
</style>
