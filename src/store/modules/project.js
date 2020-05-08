
const project = {
    state: {
        projectRole:[]
    },
    mutations: {
        set_Project_Role:(state,role)=>{
            state.projectRole = role
        }
    },
    actions: {
        setProjectRole({commit},role){
            commit('set_Project_Role',role)
        }
    }
}

export default project
