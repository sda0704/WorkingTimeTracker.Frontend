const API_URL = "http://localhost:5268/api";

export const ProjectService = {
    async getAll(){
        const response = await fetch(`${API_URL}/project`)
        return response.json()
    },

    async create(project: any){
        const response = await fetch(`${API_URL}/project`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(project)
        })
        return response.json();
    }

}