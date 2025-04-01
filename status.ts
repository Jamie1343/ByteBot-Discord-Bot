import * as discord from "npm:discord.js";
import * as info from "npm:systeminformation";

export async function botStatus(client: discord.Client) {
  let uptimeSeconds = 0,
    uptimeMins = 0,
    uptimeHours = 0;
  const channel = client.channels.cache.get("1296128428537413683");

  const CPUInfo = info.cpu().then((cpu) => {
    return cpu;
  });

  function CPUPackageUsage() {
    const load = info.currentLoad().then((cpu) => {
      return cpu.currentLoad.toFixed(2);
    });
    return load;
  }

  function CPUPackageTemp() {
    const temp = info.cpuTemperature().then((temp) => {
      return temp.main;
    });
    return temp;
  }

  const GPUInfo = info.graphics().then((gpu) => {
    return gpu;
  });

  const systemInfo = info.system().then((sys) => {
    return sys;
  });

  const status = new discord.EmbedBuilder()
    .setTitle("Alpha Bot Status")
    .setDescription(`Motherboard - ${(await systemInfo).model}\nCPU - ${(await CPUInfo).brand}\nGPU - ${(await GPUInfo).controllers[0].model}\nCPU Package Usage ${await CPUPackageUsage()}%\nCPU Package Temp - ${await CPUPackageTemp()}°C\n`);
  if (channel?.type != discord.ChannelType.GuildText) return;

  channel.send({ embeds: [status] }).then((sent) => {
    setInterval(async () => {
      if (uptimeSeconds >= 60) {
        uptimeMins++;
        uptimeSeconds = 0;
      }
      if (uptimeMins >= 60) {
        uptimeHours++;
        uptimeMins = 0;
      }

      const CPUInfo = info.cpu().then((cpu) => {
        return cpu;
      });

      function CPUPackageUsage() {
        const load = info.currentLoad().then((cpu) => {
          return cpu.currentLoad.toFixed(2);
        });
        return load;
      }

      function CPUPackageTemp() {
        const temp = info.cpuTemperature().then((temp) => {
          return temp.main;
        });
        return temp;
      }

      const GPUInfo = info.graphics().then((gpu) => {
        return gpu;
      });

      const systemInfo = info.system().then((sys) => {
        return sys;
      });

      const statusEdit = new discord.EmbedBuilder()
        .setTitle("Alpha Bot Status")
        .setDescription(
          `Motherboard - ${(await systemInfo).model}\n**CPU** - ${(await CPUInfo).brand}\n**GPU** - ${
            (await GPUInfo).controllers[0].model
          }\n**CPU Package Usage** - ${await CPUPackageUsage()}%\n**CPU Package Temp** - ${await CPUPackageTemp()}°C\n**Uptime** ${uptimeHours}h ${uptimeMins}m ${uptimeSeconds}s`
        );

      sent.edit({ embeds: [statusEdit] });
      uptimeSeconds++;
    }, 1000);
  });
}
