local _adminItemsDB = {}
local _adminTypeLabels = {
    [1] = "Consumable", [2] = "Weapon", [3] = "Tool", [4] = "Crafting",
    [5] = "Collectable", [6] = "Junk", [7] = "Other", [8] = "Evidence",
    [9] = "Ammo", [10] = "Container", [11] = "Gem", [12] = "Paraphernalia",
    [13] = "Wearable", [14] = "Contraband", [15] = "Gang Chain",
    [16] = "Attachment", [17] = "Schematic",
}

local _adminItemFiles = {
    'items/containers.lua', 'items/crafting.lua', 'items/dangerous.lua',
    'items/drugs.lua', 'items/evidence.lua', 'items/fishing.lua',
    'items/labor.lua', 'items/loot.lua', 'items/medical.lua',
    'items/misc.lua', 'items/robbery.lua', 'items/tools.lua',
    'items/unique.lua', 'items/vehicles.lua',
    'items/food/alcohol.lua', 'items/food/bakery.lua', 'items/food/beanmachine.lua',
    'items/food/burgershot.lua', 'items/food/food.lua', 'items/food/ingredients.lua',
    'items/food/noodles.lua', 'items/food/pizza_this.lua', 'items/food/prego.lua',
    'items/food/prison.lua', 'items/food/sandwich.lua', 'items/food/train.lua',
    'items/food/uwu.lua',
    'items/weapons/ammo.lua', 'items/weapons/attachments.lua', 'items/weapons/base.lua',
    'items/weapons/bobcat.lua',
    'items/schematics/attachments.lua', 'items/schematics/base.lua', 'items/schematics/weapons.lua',
}

function LoadAdminItemDatabase()
    _adminItemsDB = {}
    local _itemsSource = {}
    local stubMeta = { __index = function() return {} end }
    local _schematics = setmetatable({}, stubMeta)

    for _, filePath in ipairs(_adminItemFiles) do
        local content = LoadResourceFile('mythic-inventory', filePath)
        if content then
            local env = {
                _itemsSource = _itemsSource,
                _schematics = _schematics,
                math = math, string = string, table = table,
                pairs = pairs, ipairs = ipairs,
                tonumber = tonumber, tostring = tostring,
                type = type, setmetatable = setmetatable,
            }
            local fn, err = load(content, filePath, 't', env)
            if fn then
                fn()
            else
                print('^1[Admin] Failed to parse item file ' .. filePath .. ': ' .. tostring(err) .. '^7')
            end
        end
    end

    for _, its in pairs(_itemsSource) do
        for _, v in ipairs(its) do
            _adminItemsDB[v.name] = v
        end
    end

    local count = 0
    for _ in pairs(_adminItemsDB) do count = count + 1 end
    print('^2[Admin] Loaded ' .. count .. ' items from mythic-inventory files^7')
end

function GetSpawnLocations()
    local p = promise.new()

    Database.Game:find({
        collection = 'locations',
        query = {
            Type = 'spawn'
        }
    }, function(success, results)
        if success and #results > 0 then
            p:resolve(results)
        else
            p:resolve(false)
        end
    end)

    local res = Citizen.Await(p)
    return res
end

function RegisterCallbacks()
    Callbacks:RegisterServerCallback('Admin:GetPlayerList', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsStaff() then
            local data = {}
            local activePlayers = Fetch:All()

            for k, v in pairs(activePlayers) do
                if v and v:GetData('AccountID') then
                    local char = v:GetData('Character')
                    table.insert(data, {
                        Source = v:GetData('Source'),
                        Name = v:GetData('Name'),
                        AccountID = v:GetData('AccountID'),
                        Character = char and {
                            First = char:GetData('First'),
                            Last = char:GetData('Last'),
                            SID = char:GetData('SID'),
                        } or false,
                    })
                end
            end
            cb(data)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:GetDisconnectedPlayerList', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsStaff() then
            local rDs = exports['mythic-base']:FetchComponent('RecentDisconnects')
            cb(rDs)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:GetPlayer', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsStaff() then
            local target = Fetch:Source(data)

            if target then
                local staffGroupName = false
                if target.Permissions:IsStaff() then
                    local highestLevel = 0
                    for k, v in ipairs(target:GetData('Groups')) do
                        if C.Groups[tostring(v)] ~= nil and (type(C.Groups[tostring(v)].Permission) == 'table') then
                            if C.Groups[tostring(v)].Permission.Level > highestLevel then
                                highestLevel = C.Groups[tostring(v)].Permission.Level
                                staffGroupName = C.Groups[tostring(v)].Name
                            end
                        end
                    end
                end

                local coords = GetEntityCoords(GetPlayerPed(target:GetData('Source')))

                local char = target:GetData('Character')
                local tData = {
                    Source = target:GetData('Source'),
                    Name = target:GetData('Name'),
                    AccountID = target:GetData('AccountID'),
                    Identifier = target:GetData('Identifier'),
                    Level = target.Permissions:GetLevel(),
                    Groups = target:GetData('Groups'),
                    StaffGroup = staffGroupName,
                    Character = char and {
                        First = char:GetData('First'),
                        Last = char:GetData('Last'),
                        SID = char:GetData('SID'),
                        DOB = char:GetData('DOB'),
                        Phone = char:GetData('Phone'),
                        Jobs = char:GetData('Jobs'),
                        Coords = {
                            x = coords.x,
                            y = coords.y,
                            z = coords.z
                        }
                    } or false,
                }

                cb(tData)
            else
                local rDs = exports['mythic-base']:FetchComponent('RecentDisconnects')
                for k, v in ipairs(rDs) do
                    if v.Source == data then
                        local tData = v

                        if tData.IsStaff then
                            local highestLevel = 0
                            for k, v in ipairs(tData.Groups) do
                                if C.Groups[tostring(v)] ~= nil and (type(C.Groups[tostring(v)].Permission) == 'table') then
                                    if C.Groups[tostring(v)].Permission.Level > highestLevel then
                                        highestLevel = C.Groups[tostring(v)].Permission.Level
                                        tData.StaffGroup = C.Groups[tostring(v)].Name
                                    end
                                end
                            end
                        end

                        tData.Disconnected = true
                        tData.Reconnected = false

                        for k, v in pairs(Fetch:All()) do
                            if v:GetData('AccountID') == tData.AccountID then
                                tData.Reconnected = k
                            end
                        end

                        cb(tData)
                        return
                    end
                end

                cb(false)
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:BanPlayer', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and data.targetSource and type(data.length) == "number" and type(data.reason) == "string" and data.length >= -1 and data.length <= 90 then
            if player.Permissions:IsAdmin() or (player.Permissions:IsStaff() and data.length > 0 and data.length <= 7) then
                cb(Punishment.Ban:Source(data.targetSource, data.length, data.reason, source))
            else
                cb(false)
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:KickPlayer', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and data.targetSource and type(data.reason) == "string" and player.Permissions:IsStaff() then
            cb(Punishment:Kick(data.targetSource, data.reason, source))
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:ActionPlayer', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and data.action and data.targetSource and player.Permissions:IsStaff() then
            local target = Fetch:Source(data.targetSource)
            if target then
                local canFuckWith = player.Permissions:GetLevel() > target.Permissions:GetLevel()
                local notMe = player:GetData('Source') ~= target:GetData('Source')
                local wasSuccessful = false

                local targetChar = target:GetData('Character')
                if targetChar then
                    local playerPed = GetPlayerPed(player:GetData('Source'))
                    local targetPed = GetPlayerPed(target:GetData('Source'))
                    if data.action == 'bring' and canFuckWith and notMe then
                        local playerCoords = GetEntityCoords(playerPed)
                        Pwnzor.Players:TempPosIgnore(target:GetData("Source"))
                        SetEntityCoords(targetPed, playerCoords.x, playerCoords.y, playerCoords.z + 1.0)

                        cb({
                            success = true,
                            message = 'Brought Successfully'
                        })

                        wasSuccessful = true
                    elseif data.action == 'goto' then
                        local targetCoords = GetEntityCoords(targetPed)
                        SetEntityCoords(playerPed, targetCoords.x, targetCoords.y, targetCoords.z + 1.0)

                        cb({
                            success = true,
                            message = 'Teleported To Successfully'
                        })

                        wasSuccessful = true
                    elseif data.action == 'heal' then
                        if (notMe or player.Permissions:IsAdmin()) then
                            Callbacks:ClientCallback(targetChar:GetData("Source"), "Damage:Heal", true)
                            
                            cb({
                                success = true,
                                message = 'Healed Successfully'
                            })

                            wasSuccessful = true
                        else
                            cb({
                                success = false,
                                message = 'Can\'t Heal Yourself'
                            })
                        end
                    elseif data.action == 'attach' and canFuckWith and notMe then
                        TriggerClientEvent('Admin:Client:Attach', source, target:GetData('Source'), GetEntityCoords(targetPed), {
                            First = targetChar:GetData("First"),
                            Last = targetChar:GetData("Last"),
                            SID = targetChar:GetData("SID"),
                            Account = target:GetData("AccountID"),
                        })

                        cb({
                            success = true,
                            message = 'Attached Successfully'
                        })

                        wasSuccessful = true
                    elseif data.action == 'marker' and (canFuckWith or player.Permissions:GetLevel() == 100) then
                        local targetCoords = GetEntityCoords(targetPed)
                        TriggerClientEvent('Admin:Client:Marker', source, targetCoords.x, targetCoords.y)
                    end

                    if wasSuccessful then
                        Logger:Warn(
                            "Admin",
                            string.format(
                                "%s [%s] Used Staff Action %s On %s [%s] - Character %s %s (%s)", 
                                player:GetData("Name"),
                                player:GetData("AccountID"),
                                string.upper(data.action),
                                target:GetData("Name"),
                                target:GetData("AccountID"),
                                targetChar:GetData('First'),
                                targetChar:GetData('Last'),
                                targetChar:GetData('SID')
                            ),
                            {
                                console = (player.Permissions:GetLevel() < 100),
                                file = false,
                                database = true,
                                discord = (player.Permissions:GetLevel() < 100) and {
                                    embed = true,
                                    type = "error",
                                    webhook = GetConvar("discord_admin_webhook", ''),
                                } or false,
                            }
                        )
                    end
                    return
                end
            end
        end

        cb(false)
    end)

    Callbacks:RegisterServerCallback('Admin:CurrentVehicleAction', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and data.action and player.Permissions:IsAdmin() and player.Permissions:GetLevel() >= 90 then
            Logger:Warn(
                "Admin",
                string.format(
                    "%s [%s] Used Vehicle Action %s",
                    player:GetData("Name"),
                    player:GetData("AccountID"),
                    string.upper(data.action)
                ),
                {
                    console = (player.Permissions:GetLevel() < 100),
                    file = false,
                    database = true,
                    discord = (player.Permissions:GetLevel() < 100) and {
                        embed = true,
                        type = "error",
                        webhook = GetConvar("discord_admin_webhook", ''),
                    } or false,
                }
            )
            cb(true)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:NoClip', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            Logger:Warn(
                "Admin",
                string.format(
                    "%s [%s] Used NoClip (State: %s)",
                    player:GetData("Name"),
                    player:GetData("AccountID"),
                    data?.active and 'On' or 'Off'
                ),
                {
                    console = (player.Permissions:GetLevel() < 100),
                    file = false,
                    database = true,
                    discord = (player.Permissions:GetLevel() < 100) and {
                        embed = true,
                        type = "error",
                        webhook = GetConvar("discord_admin_webhook", ''),
                    } or false,
                }
            )
            cb(true)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:UpdatePhonePerms', function(source, data, cb)
        local player = Fetch:Source(source)
        if player.Permissions:IsAdmin() then
            local target = Fetch:Source(data.target)
            if target ~= nil then
                local char = target:GetData("Character")
                if char ~= nil then
                    local cPerms = char:GetData("PhonePermissions")
                    cPerms[data.app][data.perm] = data.state
                    char:SetData("PhonePermissions", cPerms)
                    cb(true)
                else
                    cb(false)
                end
            else
                cb(false)
            end
        else
            cb(false)
        end
    end)

    LoadAdminItemDatabase()

    Callbacks:RegisterServerCallback('Admin:GetItemList', function(source, data, cb)
        local player = Fetch:Source(source)
        if not player or not player.Permissions:IsAdmin() then
            return cb(false)
        end

        local items = {}
        for name, item in pairs(_adminItemsDB) do
            local typeNum = item.type or 7
            table.insert(items, {
                name = item.name or name,
                label = item.label or name,
                type = typeNum,
                typeLabel = _adminTypeLabels[typeNum] or "Other",
                weight = item.weight or 0,
                rarity = item.rarity or 0,
                price = item.price or 0,
                isStackable = item.isStackable or false,
                isUsable = item.isUsable or false,
                description = item.description or "",
            })
        end

        table.sort(items, function(a, b) return a.label < b.label end)
        cb(items)
    end)

    Callbacks:RegisterServerCallback('Admin:GiveItem', function(source, data, cb)
        local player = Fetch:Source(source)
        if not player or not player.Permissions:IsAdmin() then
            return cb(false)
        end

        local Inventory = exports['mythic-base']:FetchComponent('Inventory')
        local itemName = data.itemName
        local isWeapon = data.isWeapon

        if not itemName or itemName == "" then
            return cb({ success = false, message = 'No item specified' })
        end

        if _adminItemsDB[itemName] == nil then
            return cb({ success = false, message = 'Item does not exist' })
        end

        local targetSID
        if data.toSelf then
            local char = player:GetData('Character')
            if char then
                targetSID = char:GetData('SID')
            end
        else
            targetSID = tonumber(data.sid)
        end

        if not targetSID then
            return cb({ success = false, message = 'Invalid Target' })
        end

        local target = Fetch:SID(targetSID)
        if not target then
            return cb({ success = false, message = 'Player Not Online' })
        end

        local targetChar = target:GetData('Character')
        if not targetChar then
            return cb({ success = false, message = 'Target has no active character' })
        end

        local charSID = targetChar:GetData('SID')
        local quantity = tonumber(data.quantity) or 1

        if isWeapon then
            local ammo = tonumber(data.ammo) or 0
            Inventory:AddItem(charSID, itemName, 1, { ammo = ammo, clip = 0 }, 1)
        else
            Inventory:AddItem(charSID, itemName, quantity, {}, 1)
        end

        local targetName = targetChar:GetData('First') .. ' ' .. targetChar:GetData('Last')

        Logger:Warn(
            "Admin",
            string.format(
                "%s [%s] Gave Item %s (x%s) To %s (SID %s) Via Admin Panel",
                player:GetData("Name"),
                player:GetData("AccountID"),
                itemName,
                quantity,
                targetName,
                charSID
            ),
            {
                console = true,
                file = false,
                database = true,
                discord = {
                    embed = true,
                    type = "error",
                    webhook = GetConvar("discord_admin_webhook", ''),
                },
            }
        )

        cb({ success = true, message = string.format('Gave %sx %s to %s (SID %s)', quantity, _adminItemsDB[itemName].label or itemName, targetName, charSID) })
    end)

    Callbacks:RegisterServerCallback('Admin:ToggleInvisible', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            Logger:Warn(
                "Admin",
                string.format(
                    "%s [%s] Used Invisibility",
                    player:GetData("Name"),
                    player:GetData("AccountID")
                ),
                {
                    console = (player.Permissions:GetLevel() < 100),
                    file = false,
                    database = true,
                    discord = (player.Permissions:GetLevel() < 100) and {
                        embed = true,
                        type = "error",
                        webhook = GetConvar("discord_admin_webhook", ''),
                    } or false,
                }
            )

            TriggerClientEvent('Admin:Client:Invisible', source)
            cb(true)
        else
            cb(false)
        end
    end)
end