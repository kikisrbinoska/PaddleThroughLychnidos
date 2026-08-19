namespace PaddleThroughLychnidos.Domain.Shared
{
    // One open/close window on a given day of week. A shop open across
    // multiple windows in a day (e.g. closed for lunch) has multiple
    // entries with the same DayOfWeek.
    public class WeeklyHoursEntry
    {
        public DayOfWeek DayOfWeek { get; set; }
        public TimeOnly OpensAt { get; set; }
        public TimeOnly ClosesAt { get; set; }
    }
}
