function setUserSkills({skills}){
    $("#user-skills").html("")
    const filteredSkills = skills.filter(s => s!=="-1")
    $("#skills-count").text(`(${filteredSkills.length})`)
}

window.setUserSkills = setUserSkills;