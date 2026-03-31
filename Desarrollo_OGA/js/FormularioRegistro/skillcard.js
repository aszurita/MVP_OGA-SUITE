function SkillCard({code, name}){
    return `<div class="checkbox-item align-items-center" style="display:flex; gap: .5rem; cursor: pointer; width:25%; height:25px;" data-label="${name}">\
            <input id="skill-${code}" type="checkbox" class="checkbox-skill" style="width: 10px;">\
            <span style="font-size: .875rem;">${name}</span>\
        </div>`
}

window.SkillCard = SkillCard;