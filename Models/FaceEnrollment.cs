using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DYPStore.Models
{
    /// <summary>
    /// Stores averaged face descriptor (128-float vector as JSON) per user.
    /// Generated client-side via face-api.js FaceRecognitionNet.
    /// </summary>
    public class FaceEnrollment
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        /// <summary>JSON array of float[128] averaged across enrollment frames.</summary>
        [Required]
        public string DescriptorJson { get; set; } = string.Empty;

        /// <summary>Number of frames averaged to produce the descriptor (quality signal).</summary>
        public int FrameCount { get; set; } = 1;

        /// <summary>Browser/device info for audit purposes.</summary>
        [StringLength(300)]
        public string? UserAgent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
    }
}
