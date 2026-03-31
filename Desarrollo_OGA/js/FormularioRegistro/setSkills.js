function setSkills(skills){
    skills.sort((a, b) => a[1].localeCompare(b[1]));
    const skillsHTML = skills.map(([skillCode, skillName]) => SkillCard({code: skillCode, name: skillName})).join("")
    $("#skills-list").html(skillsHTML)
}

window.setSkills = setSkills;
