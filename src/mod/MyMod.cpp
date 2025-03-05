#include <nlohmann/json.hpp>
#include "mod/MyMod.h"
#include "ll/api/event/EventBus.h"
#include "ll/api/mod/RegisterHelper.h"
#include "ll/api/event/server/ServerStartedEvent.h"
#include "more_dimensions/api/dimension/CustomDimensionManager.h"
#include "more_dimensions/api/dimension/SimpleCustomDimension.h"

#include <iostream>
#include <fstream>
namespace my_mod {

MyMod& MyMod::getInstance() {
    static MyMod instance;
    return instance;
}

bool MyMod::load() {
    getSelf().getLogger().debug("Loading...");
    // Code for loading the mod goes here.
    return true;
}

bool MyMod::enable() {
    getSelf().getLogger().debug("Enabling...");
    // Code for enabling the mod goes here.
    return true;
}

bool MyMod::disable() {
    getSelf().getLogger().debug("Disabling...");
    // Code for disabling the mod goes here.
    return true;
}

} // namespace my_mod

LL_REGISTER_MOD(my_mod::MyMod, my_mod::MyMod::getInstance());


using json = nlohmann::json;

static bool reg = [] {

    using namespace ll::event;
    // 模拟事件系统，监听服务器启动事件
    EventBus::getInstance().emplaceListener<ServerStartedEvent>([](ServerStartedEvent&) {
        // 读取配置文件
        std::ifstream file("config.json");
        if (!file.is_open()) {
            std::cerr << "无法打开配置文件 config.json！" << std::endl;
            return;
        }

        json config;
        file >> config;
        file.close();

        // 遍历 JSON 配置中的维度数组
        for (const auto& dim : config["dimensions"]) {
            std::string name = dim["name"];
            int seed = dim["seed"];
            std::string typeStr = dim["type"];
            GeneratorType genType;

            // 根据配置文件中的类型字段来决定维度的类型
            if (typeStr == "Overworld") {
                genType = GeneratorType::Overworld;
            } else if (typeStr == "Flat") {
                genType = GeneratorType::Flat;
            } else if (typeStr == "Nether") {
                genType = GeneratorType::Nether;
            } else if (typeStr == "TheEnd") {
                genType = GeneratorType::TheEnd;
            } else if (typeStr == "Void") {
                genType = GeneratorType::Void;
            } else {
                std::cerr << "未知的维度类型: " << typeStr << "，跳过此配置" << std::endl;
                continue;
            }

            // 使用维度管理器添加维度
            more_dimensions::CustomDimensionManager::getInstance()
                .addDimension<more_dimensions::SimpleCustomDimension>(name, seed, genType);
            std::cout << "成功加载维度: " << name << " 类型: " << typeStr << " 种子: " << seed << std::endl;
        }
    });

    return true;
}();
