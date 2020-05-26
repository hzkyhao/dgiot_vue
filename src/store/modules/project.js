
const project = {
    state: {
        projectRole: [],
        deptInfo: {},
        DialogFlag: false
    },
    mutations: {
        set_Project_Role: (state, role) => {
            state.projectRole = role
        },
        set_Dept_Info: (state, info) => {
            state.deptInfo = info
        },
        set_Dialog_Flag: (state, flag) => {
            state.DialogFlag = flag
        }
    },
    actions: {
        setProjectRole ({ commit }, role) {
            commit('set_Project_Role', role)
        },
        setDeptInfo ({ commit }, info) {
            commit('set_Dept_Info', info)
        },
        setDialogFlag ({ commit }, flag) {
            commit('set_Dialog_Flag', flag)
        }
    }
}

export default project
