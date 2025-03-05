// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Lenovo/dts/HelperLib-master/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "more-dimensions-helper",
    /* introduction */ "多维度辅助插件",
    /* version */[6, 0, 0]
);
function convertToSnakeCase(str) {
    let result = '';

    // 遍历字符串中的每一个字符
    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        // 判断是否为大写字母
        if (/[A-Z]/.test(char)) {
            // 如果是大写字母，转换为下划线加小写字母
            result += '_' + char.toLowerCase();
        } else {
            // 否则直接添加到结果中
            result += char;
        }
    }

    return result;
}
mc.listen('onServerStarted', () => {
    log("多维度辅助插件加载成功")

    const text = "\n" + "     _ __ ___     ___    _ __    ___                                \n" + "    | '_ ` _ \\   / _ \\  | '__|  / _ \\                               \n" + "    | | | | | | | (_) | | |    |  __/                               \n" + "    |_| |_| |_|  \\___/  |_|     \\___|                               \n" + "                                                                    \n" + "         _   _                                    _                 \n" + "      __| | (_)  _ __ ___     ___   _ __    ___  (_)   ___    _ __  \n" + "     / _` | | | | '_ ` _ \\   / _ \\ | '_ \\  / __| | |  / _ \\  | '_ \\ \n" + "    | (_| | | | | | | | | | |  __/ | | | | \\__ \\ | | | (_) | | | | |\n" + "     \\__,_| |_| |_| |_| |_|  \\___| |_| |_| |___/ |_|  \\___/  |_| |_|\n" + "                                                                    \n" + "     _              _                                               \n" + "    | |__     ___  | |  _ __     ___   _ __                         \n" + "    | '_ \\   / _ \\ | | | '_ \\   / _ \\ | '__|                        \n" + "    | | | | |  __/ | | | |_) | |  __/ | |                           \n" + "    |_| |_|  \\___| |_| | .__/   \\___| |_|                           \n" + "                       |_|                                          "
    log(text)
    function Callback(cmd, origin, out, res) {
        let dimdata = JSON.parse(new JsonConfigFile(`./config.json`).read());
        let dimlist = dimdata["dimensions"]
        let fm = mc.newSimpleForm()
        fm.setTitle("more dimension helper")
        fm.addButton(`添加维度的入口(重启后生效)`)
        fm.addButton(`删除维度的入口(重启后生效)`)
        dimlist.forEach((value, index) => {
            fm.addButton(`额外维度${index + 1}:${dimlist[index]["name"]}`)
        })
        origin.player.sendForm(fm, (player, id, reason) => {
            switch (id) {
                case 0:
                    {
                        let add = mc.newCustomForm()
                        add.addInput("维度名字", "请输入维度的名字(必须英文)")
                        add.addDropdown("选择维度的生成器类型", ["主世界", "地狱", "末地", "超平坦", "虚空"])
                        add.addInput("维度种子", "请输入维度的种子(必须整数)")
                        player.sendForm(add, (player2, data2, reason2) => {
                            if (mc.getPlayer(player2.name).isOP) {

                                let newdimlist = dimlist.concat({ "name": data2[0], "seed": parseInt(data2[2]), "type": ["Overworld", "Nether", "TheEnd", "Flat", "Void"][data2[1]] })
                                let dimconfig = new JsonConfigFile(`./config.json`)
                                dimconfig.set("dimensions", newdimlist)
                                //mc.runcmdEx("ll reactivate simple-dimensions")
                                player2.tell(`创建维度${data2[0]},类型${["Overworld", "Nether", "TheEnd", "Flat", "Void"][data2[1]]},种子${parseInt(data2[2])}`)
                            } else { player2.tell("你没有权限！") }
                        })
                        break
                    }
                case 1:
                    {
                        let del = mc.newCustomForm()
                        let dimnamelist = []
                        
                        dimlist.forEach((value, index) => { dimnamelist=dimnamelist.concat(value.name) })
                        del.addDropdown("选择要删除的维度入口", dimnamelist)

                        player.sendForm(del, (player2, data2, reason2) => {
                            if (mc.getPlayer(player2.name).isOP) {
                                let newdimlist = dimlist
                                newdimlist.splice(data2[0], 1)
                                //let newdimlist=dimlist.concat({ "name": data2[0], "seed": parseInt(data2[2]), "type": ["Overworld","Nether","TheEnd","Flat","Void"][data2[1]] })
                                let dimconfig = new JsonConfigFile(`./config.json`)
                                dimconfig.set("dimensions", newdimlist)
                            } else { player2.tell("你没有权限！") }
                        })
                        break
                    }
                default:
                    {
                        if (mc.getPlayer(player.name).isOP) {
                            let dimnamelist = []
                            dimlist.forEach((value, index) => {dimnamelist= dimnamelist.concat(value.name) })
                            mc.getPlayer(player.name).runcmd(`tpdim @s ~~~ ${convertToSnakeCase(dimnamelist[id - 2])}`)
                        }else { player2.tell("你没有权限！") }
                    }
            }
        })
    }
    let cmd = mc.newCommand("moredimensionhelper", '多维度辅助插件', PermType.Any)
    cmd.setAlias("mdh");


    cmd.overload([]);
    cmd.setCallback(Callback);
    cmd.setup()
})


