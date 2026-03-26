function getSkillSuggestions({rolFuncion}={}){
    const filtered = window.longLoc.filter(e=>e.rolFuncion === rolFuncion)
    const skills = filtered.map(e=>e.habilidades.split("|")).flat()
    return Array.from(new Set(skills))
}

window.getSkillSuggestions = getSkillSuggestions;