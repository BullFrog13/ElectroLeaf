using Nanoleaf.Client;
using System.Windows;

namespace Nanoleaf_Desktop
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private async void Button_Click(object sender, RoutedEventArgs e)
        {
            using(var nanoleaf = new NanoleafClient("192.168.0.10", "qEQ8ZLcPuOVesarDXIW6eGQQd1Hhn1d9"))
            {
                var status = await nanoleaf.GetPowerStatusAsync();

                if (status)
                {
                    nanoleaf.TurnOffAsync().Wait(1000);
                }
                else
                {
                    nanoleaf.TurnOnAsync().Wait(1000);
                }
            }
        }
    }
}