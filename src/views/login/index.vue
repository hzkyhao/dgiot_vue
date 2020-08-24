<template>
<div :style="{background: 'url(' +(loginbannersrc ? loginbannersrc : backgroundsrc)+') no-repeat cover'}" class="login-container">
    <div class="loginbanner">
        <!-- <Pointwave style="width:100%;height:100%"></Pointwave> -->
        <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
            <div class="logo">
                <img :src="logosrc || index_logo" alt="logo" style="width:80px;height:80px;">
                <p>{{ title }}</p>
            </div>
            <div v-show="false" style="margin: 20px">
                <el-radio v-model="roleType" disabled label="pump">水泵登录</el-radio>
                <el-radio v-model="roleType" label="default">平台登录</el-radio>
            </div>
            <!-- <h5 style="text-align:center;font-size:20px;color:rgba(0, 0, 0, 0.647058823529412);margin:20px 0;">账号密码登录</h5> -->
            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="请输入手机号/用户名" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input v-model="loginForm.password" :type="pwdType" name="password" auto-complete="on" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon icon-class="eye" />
                </span>
            </el-form-item>
            <div style="margin-bottom:40px;height:30px;line-height:30px;">
                <el-checkbox v-model="checked" style="float:left;color:#409EFF">记住密码</el-checkbox>

                <span style="float:right;color:#409EFF;font-size:14px;cursor:pointer" @click="resetPassword">
                    忘记密码
                    <span>?</span>
                </span>
            </div>
            <el-form-item>
                <el-button type="primary" style="width:100%;letter-spacing:10px;" @click.native.prevent="handleLogin">登录</el-button>
            </el-form-item>
            <span style="float:left;color:#409EFF;font-size:14px;cursor:pointer;margin-right:20px;" @click="phonelogin">手机号登录</span>
            <span style="float:right;color:#409EFF;font-size:14px;cursor:pointer" @click="register">注册用户</span>
        </el-form>
    </div>
</div>
</template>

<script>
import {
    isvalidUsername
} from '@/utils/validate'
import {
    Parse
} from 'parse'
import {
    getsession
} from '@/utils/wxscoket.js'
import {
    Sitepro
} from '@/api/login'
import {
    license
} from '@/api/license'
export default {
    name: 'Login',
    beforeRouteEnter(to, from, next) {
        // 注意，在路由进入之前，组件实例还未渲染，所以无法获取this实例，只能通过vm来访问组件实例
        next(vm => {
            // this.getTitle()
            //  document.title=this.title
        })
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!isvalidUsername(value)) {
                callback(new Error('请输入正确的用户名'))
            } else {
                callback()
            }
        }
        const validatePass = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('密码不能小于5位'))
            } else {
                callback()
            }
        }
        return {
            reset: false,
            title: '',
            roleType: 'default',
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{
                    required: true,
                    trigger: 'blur',
                    validator: validateUsername
                }],
                password: [{
                    required: true,
                    trigger: 'blur',
                    validator: validatePass
                }]
            },
            loading: false,
            pwdType: 'password',
            checked: false,
            imgsrc: require('../../imgages/u50.png'),
            index_logo: require('../../imgages/index_logo.png'),
            logosrc: '',
            backgroundsrc: require('../../imgages/loginbanner.jpg'),
            routes: [],
            loginbannersrc: false
        }
    },
    created() {
        this.getlicense()
        this.getTitle()
    },
    mounted() {},
    methods: {
        getlicense() {
            license().then(resultes => {
                if (resultes.result == false) {
                    this.$router.push({
                        path: '/license'
                    })
                } else {
                    // this.$router.push("/login");
                    localStorage.setItem('list', '[]')
                }
            })
        },
        // 获取标题
        getTitle() {
            // Parse.User.logOut();
            Sitepro(this.roleType).then(resultes => {
                if (!resultes) {
                    resultes = {}
                }
                this.title = resultes.title
                document.title = this.title ? this.title : '采集管理系统'

                this.logosrc = resultes.logo
                this.loginbannersrc = resultes.background

                this.$Cookies.set('appid', resultes.objectId)
                this.$Cookies.set('roletype', this.roleType)
                this.$Cookies.set('application', this.roleType)

                sessionStorage.setItem('product_title', resultes.title ? resultes.title : '')
                sessionStorage.setItem('dashboard', resultes.dashboard ? resultes.dashboard : '#')
                sessionStorage.setItem('imgsrc', resultes.logo ? resultes.logo : '')
                sessionStorage.setItem('copyright', resultes.copyright ? resultes.copyright : '')
                sessionStorage.setItem('roletype', this.roleType)
            })
        },
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        handleLogin() {
            this.routes = []
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    const loading = this.$loading();
                    // Parse.User.logIn(this.loginForm.username, this.loginForm.password)
                    //   .then(user => {
                    //     getsession(user.attributes.sessionToken)

                    //     this.$Cookies.set('sessionToken', user.attributes.sessionToken)
                    //     this.$Cookies.set('username', user.attributes.username)

                    //     this.$store.dispatch('setRoles', user.attributes.roles)
                    //     var Menu = Parse.Object.extend('Navigation')
                    //     var menu = new Parse.Query(Menu)
                    //     menu.find().then(menu => {
                    //       var menu1 = menu
                    //       menu1.map(items => {
                    //         if (items.attributes.parent) {
                    //           this.routes.push(items)
                    //         }
                    //       })
                    //       sessionStorage.setItem('username', user.attributes.username)
                    //       sessionStorage.setItem('roles', user.attributes.roles[0] ? user.attributes.roles[0].alias : '')

                    //       this.$Cookies.set('appids', user.attributes.roles[0] ? user.attributes.roles[0].name : '')

                    //       localStorage.setItem('list', JSON.stringify(this.routes))

                    //       this.$router.push({ path: '/dashboard' })
                    //     })
                    //   })
                    this.$axiosWen
                        .post("/login", {
                            username: this.loginForm.username,
                            password: this.loginForm.password
                        })
                        .then(user => {
                            loading.close();
                            getsession(user.sessionToken)
                            this.$Cookies.set('sessionToken', user.sessionToken)
                            this.$Cookies.set('username', user.username)
                            this.$store.dispatch('setRoles', user.roles)
                            sessionStorage.setItem('username', user.username)
                            sessionStorage.setItem('roles', user.roles[0] ? user.roles[0].alias : '')
                            this.$Cookies.set('appids', user.roles[0] ? user.roles[0].name : '')
                            this.getNavigation()
                        })
                        .catch(error => {
                            loading.close();
                            if (error.code == 101) {
                                if (error.message.indexOf('Invalid') == -1) {
                                    this.$message({
                                        type: 'warning',
                                        message: '密码输入错误次数过多，该账户已被锁住'
                                    })
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: '用户名或密码错误'
                                    })
                                }
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: error.message
                                })
                            }
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // http://192.168.2.51:5080/swagger/#/Menu/get_classes_navigation
        // params  可选参数 order  limit
        getNavigation() {
            this.$axiosWen.get('/classes/Navigation').then(res => {
                console.log(res.results)
                var menu = res.results
                menu.map(items => {
                    if (items.parent) {
                        this.routes.push(items);
                    }
                });
                localStorage.setItem('list', JSON.stringify(this.routes))
                this.$router.push({
                    path: '/dashboard'
                })
            }).catch(e => {
                console.log(e.error)
            })
        },
        resetPassword() {
            this.$router.push({
                path: '/resetpassword'
            })
        },
        register() {
            this.$router.push({
                path: '/register'
            })
        },
        phonelogin() {
            this.$router.push({
                path: '/phonelogin',
                query: {
                    action: 'login'
                }
            })
        }
    }
}
</script>

<style lang="scss">
$light_gray: rgba(0, 0, 0, 0.247058823529412);

/* reset element-ui css */

.login-container {
    background: url("../../imgages/loginbanner.jpg") no-repeat;
    height: 100%;
    background-size: cover;
    overflow-y: scroll; // opacity:0.8;

    .loginbanner {
        background: transparent;
        padding: 16px;
        box-sizing: border-box;

        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 1px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;

                &:-webkit-autofill {
                    // -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: black !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: #ffffff;
            border-radius: 5px;
            color: #454545;
        }
    }
}
</style>

<style lang="scss" scoped>
$bg: rgba(45, 58, 75, 0.8);
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;

    .login-form {
        position: absolute;
        height: 500px;
        right: 5%;
        width: 520px;
        max-width: 100%;
        padding: 35px 35px 15px 35px;
        margin: 120px;
        background: #ffffff;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
            0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
        border-radius: 5px;
    }

    @media screen and (max-width: 1024px) {
        .login-form {
            width: auto;
            max-width: 100%;
            padding: 35px 35px 15px 35px;
            margin: 1.2rem;
        }
    }

    .login_bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        width: 520px;
        max-width: 100%;
        padding: 35px 35px 15px 35px;
        margin: 0 auto;
        text-align: center;
        color: #ffffff;
        font-size: 14px;

        img {
            height: 16px;
            width: 16px;
            vertical-align: middle;
            margin: 0 2px;
        }
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}

.logo {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    p {
        font-size: 30px;
        font-weight: bold;
        margin: 25px 0;
    }
}

.login-container .el-form-item__content {
    border: 1px solid #cccccc;
    border-radius: 5px;
}

.login-container .loginbanner .el-input input {
    color: black;
}
</style>
